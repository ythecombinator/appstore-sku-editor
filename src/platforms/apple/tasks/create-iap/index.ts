import { Page } from 'puppeteer';

import { findClosest } from '../../../../util/array';

import { GoogleSheetsInAppPurchase } from '../../models/InAppPurchase';
import { mapPricingOptions } from '../../util/array';

import { askForData } from './ask-for-data';
import { fillFirstSection } from './fill-first-section';
import { fillSecondSection } from './fill-second-section';
import { fillThirdSection } from './fill-third-section';
import { fetchAvailablePrices } from './fetch-available-prices';
import { selectBasePricing } from './select-base-pricing';
import { clickNext } from './click-next';
import { clickSave } from './click-save';
import { clickCreate } from './click-create';
import { loadPricingOptions } from './load-pricing-options';
import { setPricingOptions } from './set-pricing-options';

const createInAppPurchase = async (
  page: Page,
  baseInAppPurchase: GoogleSheetsInAppPurchase
) => {
  const { data } = baseInAppPurchase;

  // Ask for data
  const { referenceName, productId } = await askForData(baseInAppPurchase);

  // Click on + button

  await page.waitForSelector('a[ng-click="showAddonPickerModal()"]');
  await page.evaluate(() => {
    const createButton = document.querySelector(
      'a[ng-click="showAddonPickerModal()"]'
    ) as HTMLElement;

    createButton?.click();
  });

  // Fill FIRST part of the form

  await fillFirstSection(page);

  // Fill SECOND part of the form

  await fillSecondSection(page, referenceName, productId);

  // Fill THIRD part of the form

  await fillThirdSection(page);

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
  const usdPrice = data.find(item => item.region === usdRegion)?.price!;

  // Get the available values

  const rawOptions = await fetchAvailablePrices(page);

  // Finding the desired price in USD

  const options = mapPricingOptions(rawOptions);

  const optionValues = options.map(option => option.value);

  const closest = findClosest(optionValues, usdPrice);

  const optionToBeChecked = options.find(option => option.value === closest)!;

  // Select the USD pricing

  await selectBasePricing(page, optionToBeChecked);

  // Click 'Next'

  await clickNext(page);

  // Load all options

  await loadPricingOptions(page);

  // Loop through prices

  await setPricingOptions(page, data);

  // Loop through prices

  // Click 'Create'

  await clickCreate(page);

  // Click 'Save'

  await clickSave(page);
};

export { createInAppPurchase };
