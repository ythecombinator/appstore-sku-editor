import { Page } from 'puppeteer';

import { AppStoreConnectPricingOption } from '../../models/AppStoreConnectPricingOption';

const fetchAvailablePrices = async (page: Page) => {
  await page.waitFor(10000);

  const rawOptions = await page.evaluate(() => {
    const selects = Array.from(
      document.querySelectorAll(
        'select[ng-options="price as price.display for price in data.basePriceList"]'
      )
    );
    const select = selects.find(item => item.children.length > 100);

    const rawOptions = Array.from(select?.children!) as HTMLOptionElement[];
    const mappedOptions = rawOptions.map(option => ({
      key: option.value,
      value: option.innerText,
    }));

    return mappedOptions as AppStoreConnectPricingOption[];
  });

  return rawOptions;
};

export { fetchAvailablePrices };
