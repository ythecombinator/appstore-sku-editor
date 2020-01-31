import { Page } from 'puppeteer';

import {
  MappedInAppPurchase,
  RawInAppPurchasePricing,
  MappedInAppPurchasePricing,
} from '../models/InAppPurchase';
import { formatRegion, formatCurrency, formatPrice } from '../util/string';

// Helpers

const mapInAppPurchasesData = (items: RawInAppPurchasePricing[]) => {
  return items.map(item => ({
    region: formatRegion(item.regionDescriptor),
    currency: formatCurrency(item.regionDescriptor),
    price: {
      initial: formatPrice(item.price),
      year1: formatPrice(item.priceAfterYear1),
      year2: formatPrice(item.priceAfterYear2),
    },
  }));
};

// Handlers

const handleNoPriceChanges = async (page: Page) => {
  // Click on `Current Price`
  await page.evaluate(() => {
    const currentPriceButton = Array.from(
      document.querySelectorAll('a')
    ).filter(a => a.textContent?.includes('Current Price'))[0];

    currentPriceButton.click();
  });

  // Find the table element
  const data = await page.evaluate(() => {
    const title = document.querySelectorAll(
      `h1[ng-bind-html="l10n.interpolate('ITC.apps.iap.20.ProceedsByTerritory.titleCurrent')"]`
    )[0];

    const parent = title.parentElement;

    const allChildren = Array.from(parent!.children);

    const tableContainer = allChildren.find(
      el => el.className === 'fixedTableWrapper'
    );

    const table = Array.from(tableContainer!.children).find(
      el => el.tagName === 'TABLE'
    );

    // Iterate through the table
    const ths = Array.from(table!.querySelectorAll('th'));
    const headers = ths.map((_, i) => {
      switch (i) {
        case 0: {
          return 'regionDescriptor';
        }
        case 1: {
          return 'price';
        }
        case 2: {
          return 'priceAfterYear1';
        }
        case 3: {
          return 'priceAfterYear2';
        }
        default: {
          return 'unknown';
        }
      }
    });

    const trs = Array.from(
      document.querySelectorAll(
        'tr[ng-repeat="terr in pricingDisplay[tempPageContent.proceedsModalDate].value"]'
      )
    );

    let results = [] as RawInAppPurchasePricing[];

    trs.forEach(tr => {
      let r = {} as RawInAppPurchasePricing;
      let tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);

      headers.forEach((k, i) => ((r as any)[k] = tds[i]));
      results.push(r);
    });

    return results;
  });

  const formattedData = mapInAppPurchasesData(data);

  return formattedData;
};

const handlePriceChanges = () => {};

// Task

const fetchIAPdata = async (page: Page, item: MappedInAppPurchase) => {
  // Navigate to item
  await page.goto(item.url, { waitUntil: 'networkidle0' });

  // Click on 'View all Subscription Pricing' button
  await page.evaluate(() => {
    const viewAllSubscriptionPricingButton = document.querySelector(
      '[ng-click="viewSubPricingDetails()"]'
    ) as HTMLElement;

    viewAllSubscriptionPricingButton?.click();
  });

  // Switch handling based on whether there are price changes or not
  const hasPriceChanges = await page.evaluate(() => {
    const pricingTable = document.querySelector(
      '[ng-show="showDateSchedule && futurePriceChangeCount !== tempPageContent.pricingDisplayArray.length"]'
    ) as HTMLElement;

    const { children } = pricingTable;

    return children.length > 2;
  });

  let pricingTable = [] as MappedInAppPurchasePricing[];

  if (hasPriceChanges) {
    handlePriceChanges();
  } else {
    pricingTable = await handleNoPriceChanges(page);
  }

  return pricingTable;
};

export { fetchIAPdata };