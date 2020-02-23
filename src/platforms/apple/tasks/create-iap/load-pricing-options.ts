import { Page } from 'puppeteer';

const { angular } = window;

const loadPricingOptions = async (page: Page) => {
  await page.waitFor(30000);
  await page.evaluate(() => {
    const tables = document.querySelectorAll(
      'table[class="openTopTable territoryPricing stickyHeaderTable"]'
    );

    const countriesTable = Array.from(tables).find(
      table => (table as HTMLTableElement).tBodies[0].children.length > 100
    );

    const countries = Array.from(
      (countriesTable as HTMLTableElement)!.tBodies[0].children
    );

    countries.forEach((countryTd, index) => {
      const selectElement = countryTd
        .querySelectorAll('td')[1]
        .querySelector(
          'select[class="custom ng-pristine ng-untouched ng-valid ng-not-empty"]'
        );

      const id = `countries-select_element-${index}`;
      const idSelector = `#${id}`;

      selectElement!.id = id;

      const territoryData = angular.element(idSelector).scope().terr;

      angular
        .element(idSelector)
        .scope()
        .data.postLoadCountryPriceList(territoryData);

      angular
        .element(idSelector)
        .scope()
        .$apply();
    });
  });
};

export { loadPricingOptions };
