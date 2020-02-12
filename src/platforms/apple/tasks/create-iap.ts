// @ts-nocheck
import { Page } from 'puppeteer';
import { timeout } from 'util/function';
import { prompt } from '../../../util/terminal';

const createInAppPurchase = async (page: Page) => {
  // Ask for data

  const referenceName = 'referenceName13';
  const productId = 'productId13';

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
};

export { createInAppPurchase };
