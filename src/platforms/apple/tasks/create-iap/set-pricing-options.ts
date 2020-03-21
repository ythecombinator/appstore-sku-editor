import { Page } from 'puppeteer';
import { MappedInAppPurchasePricing } from '../../models/InAppPurchase';

interface Option {
  selector: string;
  value: string;
}

const setPricingOptions = async (
  page: Page,
  data: MappedInAppPurchasePricing[]
) => {
  await page.waitFor(30000);

  const browserData = JSON.stringify(data);

  const options = await page.evaluate(browserData => {
    // Params
    const data = JSON.parse(browserData);

    // Helpers
    const parenthesesRegExp = /\(([^)]+)\)/;
    const numbersRegExp = /\D+/g;

    const formatRegion = (descriptor: string) =>
      descriptor.replace(parenthesesRegExp, '');

    const formatPrice = (price: string) =>
      Number(price.replace(numbersRegExp, ''));

    const findClosest = (arr: number[], goal: number) =>
      arr.reduce((prev, curr) =>
        Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
      );

    // Scraping
    const tables = document.querySelectorAll(
      'table[class="openTopTable territoryPricing stickyHeaderTable"]'
    );

    const countriesTable = Array.from(tables).find(
      table => (table as HTMLTableElement).tBodies[0].children.length > 100
    );

    const countries = Array.from(
      (countriesTable as HTMLTableElement)!.tBodies[0].children
    );

    const iterable: Option[] = [];

    countries.forEach((countryEl, i) => {
      // Identifier
      const rawRegionIdentifier = (countryEl.children[0] as HTMLTableRowElement)
        .innerText;
      const regionIdentifier = formatRegion(rawRegionIdentifier);

      // Desired price
      const price = data.find((item: any) => item.region === regionIdentifier)
        ?.price!;

      // DOM handling

      const selectEl = countries[i].children[1].querySelector('select');
      const selectElId = `setPricingOptions-selectEl-${i}`;
      selectEl?.setAttribute('id', selectElId);

      const optionEls = Array.from(selectEl!.children) as HTMLOptionElement[];
      const options: string[] = optionEls.map(option => (option as any).label);
      const formattedOptions = options.map(option => formatPrice(option));

      const closest = findClosest(formattedOptions, price);
      const optionToBeChecked = optionEls.find(
        option => formatPrice(option.label) === closest
      )!;

      iterable.push({ selector: selectElId, value: optionToBeChecked.value });
    });

    return iterable;
  }, browserData);

  await page.waitFor(3000);

  const optionsPromises = options.map(option =>
    page.select(`select[id='${option.selector}']`, option.value)
  );

  await Promise.all(optionsPromises);

  await page.waitFor(3000);
};

export { setPricingOptions };
