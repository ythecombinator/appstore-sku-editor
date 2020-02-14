import { Page } from 'puppeteer';

import { meter } from '../../../util/performance';
import { logger } from '../../../util/terminal';
import { AppStoreConnectConfig } from '../models/AppStoreConnectConfig';
import { fetchFromSpreadsheet } from '../tasks/fetch-from-spreadsheet';
import { login } from '../tasks/login';
import { navigateToIAPs } from '../tasks/navigate-to-iap';
import { navigateToMyApps } from '../tasks/navigate-to-my-apps';
import { createInAppPurchase } from '../tasks/create-iap';

const pushData = async (page: Page, config: AppStoreConnectConfig) => {
  const { app, credentials } = config;

  meter.start();

  // Getting items
  const items = await fetchFromSpreadsheet();

  // Signing In
  logger.init('Signing in');
  await login(page, credentials);
  logger.finish('Signing in');

  // Navigating to apps list
  logger.init('Navigating to apps list');
  await navigateToMyApps(page);
  logger.finish('Navigating to apps list');

  // Iterating results
  let proccessedItems = 0;

  for (const item of items) {
    // Navigating to IAPs list
    logger.init('Navigating to IAPs list');
    await navigateToIAPs(page, app.id);
    logger.finish('Navigating to IAPs list');

    // Creating IAP
    logger.init(`Creating new IAP for item: ${item.id}`);
    await createInAppPurchase(page, item);
    logger.finish(`Creating new IAP for item: ${item.id}`);

    // Incrementing the counter
    proccessedItems++;
  }

  const { time } = meter.stop();
  logger.info(`Pushed ${proccessedItems} items in ${time}s. 🤓`);
};

export { pushData };
