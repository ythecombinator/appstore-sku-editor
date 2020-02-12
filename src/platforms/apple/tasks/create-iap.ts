// @ts-nocheck
import { Page } from 'puppeteer';

import { GoogleSheetsInAppPurchase } from '../models/InAppPurchase';
import { AppStoreConnectPricingOption } from '../models/AppStoreConnectPricingOption';

const createInAppPurchase = async (
  page: Page,
  baseInAppPurchase: GoogleSheetsInAppPurchase
) => {
  // Ask for data

  const referenceName = 'referenceName19';
  const productId = 'productId19';

  // const referenceName = await prompt('Enter the Reference Name: ');
  // const productId = await prompt('Enter the Product ID: ');

  // Click on + button

  await page.waitForSelector('a[ng-click="showAddonPickerModal()"]');
  await page.evaluate(() => {
    const createButton = document.querySelector(
      'a[ng-click="showAddonPickerModal()"]'
    ) as HTMLElement;

    createButton?.click();
  });

  // Fill FIRST part of the form

  await page.waitFor(5000);

  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(
      el => el.innerText === 'Auto-Renewable Subscription'
    );

    const checkbox = heading?.parentElement?.querySelector('a');
    checkbox?.click();

    const button = Array.from(document.querySelectorAll('button')).find(
      el => el.innerText === 'Create'
    );
    button?.click();
  });

  // Fill SECOND part of the form

  await page.waitFor(5000);

  await page.type(
    'input[ng-model="data.newSub.displayName.value"]',
    referenceName
  );

  await page.type('input[ng-model="data.newSub.productId.value"]', productId);

  const nextButton = (await page.$(
    'button[ng-click="onNext()"]'
  )) as HTMLElement;
  nextButton?.click();

  // Fill THIRD part of the form

  await page.waitFor(5000);

  await page.evaluate(() => {
    // Select Subscription Group
    const premiumLabel = Array.from(document.querySelectorAll('label')).find(
      el => el.innerText === 'Premium'
    );
    const premiumContainer = premiumLabel?.parentElement;
    const premiumCheckbox = premiumContainer?.querySelector('a');
    premiumCheckbox?.click();

    // Click 'Create'
    const createButton = document.querySelector(
      'button[ng-click="onNext()"]'
    ) as HTMLElement;
    createButton?.click();
  });

  // Click on + button

  await page.waitFor(60000);
  await page.evaluate(() => {
    const createButton = document.querySelector(
      'a[ng-click="launchNewPriceModal()"]'
    ) as HTMLElement;
    createButton?.click();
  });

  // Get the default value

  const usdRegion = 'United States ';
  const usdPrice = baseInAppPurchase.data.find(
    item => item.region === usdRegion
  )?.price;

  // Get the available values
  await page.waitFor(10000);
  const options = await page.evaluate(() => {
    const selects = Array.from(
      document.querySelectorAll(
        'select[ng-options="price as price.display for price in data.basePriceList"]'
      )
    );
    const select = selects.find(item => item.children.length > 100);

    const rawOptions = Array.from(select.children) as HTMLOptionElement[];
    const mappedOptions = rawOptions.map(option => ({
      key: option.value,
      value: option.innerText,
    }));

    return mappedOptions as AppStoreConnectPricingOption[];
  });

  console.log(options);
};

export { createInAppPurchase };
