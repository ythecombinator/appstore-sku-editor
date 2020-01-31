import { Page } from 'puppeteer';

import { MappedInAppPurchase } from '../models/InAppPurchase';

// Helpers

const handleNoPriceChanges = () => {};

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

  if (hasPriceChanges) {
    handlePriceChanges();
  } else {
    handleNoPriceChanges();
  }
};

export { fetchIAPdata };
