import { Page } from 'puppeteer';

import {
  MappedInAppPurchase,
  MappedInAppPurchasePricing,
} from '../../models/InAppPurchase';
import { handleNoPriceChanges } from './handleNoPriceChanges';
import { handlePriceChanges } from './handlePriceChanges';

// Task

const fetchIAPdata = async (page: Page, _: MappedInAppPurchase) => {
  // Navigate to item
  await page.goto(
    'https://appstoreconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/709551897/addons/1147114543',
    { waitUntil: 'networkidle0' }
  );

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
    pricingTable = await handlePriceChanges(page);
  } else {
    pricingTable = await handleNoPriceChanges(page);
  }

  return pricingTable;
};

export { fetchIAPdata };
