// @ts-nocheck
import { Page } from 'puppeteer';

import { meter } from '../../../util/performance';
import { logger } from '../../../util/terminal';
import { AppStoreConnectConfig } from '../models/AppStoreConnectConfig';
import { fetchFromSpreadsheet } from '../tasks/fetch-from-spreadsheet';
import { login } from '../tasks/login';
import { navigateToIAPs } from '../tasks/navigate-to-iap';
import { navigateToMyApps } from '../tasks/navigate-to-my-apps';

const pushData = async (page: Page, config: AppStoreConnectConfig) => {
  const { app, credentials } = config;

  meter.start();

  // Getting data
  const data = await fetchFromSpreadsheet();
  console.log(data[0]);

  // Signing In
  logger.init('Signing in');
  // await login(page, credentials);
  logger.finish('Signing in');

  // Navigating to apps list
  logger.init('Navigating to apps list');
  // await navigateToMyApps(page);
  logger.finish('Navigating to apps list');

  // Navigating to IAPs list
  logger.init('Navigating to IAPs list');
  // await navigateToIAPs(page, app.id);
  logger.finish('Navigating to IAPs list');

  // Iterating results
  let proccessedItems = 0;

  const { time } = meter.stop();
  logger.info(`Fetched ${proccessedItems} items in ${time}s. 🤓`);
};

export { pushData };
