import { Page } from 'puppeteer';

import { AppStoreConnectPricingOption } from '../../models/AppStoreConnectPricingOption';

interface Option extends Pick<AppStoreConnectPricingOption, 'key'> {
  value: number;
}

const selectBasePricing = async (page: Page, optionToBeChecked: Option) => {
  await page.evaluate(() => {
    const selects = Array.from(
      document.querySelectorAll(
        'select[ng-options="price as price.display for price in data.basePriceList"]'
      )
    );
    const select = selects.find(
      item => item.children.length > 100
    ) as HTMLSelectElement;

    select.id = 'usd-pricing-select';
  });

  const usdPricingKey = optionToBeChecked?.key as string;
  page.select('#usd-pricing-select', usdPricingKey);
};

export { selectBasePricing };
