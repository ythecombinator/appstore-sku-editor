import { Page } from 'puppeteer';

import { meter } from '../../../util/performance';
import { logger } from '../../../util/terminal';
import { AppStoreConnectConfig } from '../models/AppStoreConnectConfig';
import { cleanupSpreadsheet } from '../tasks/cleanup-spreadsheet';
import { fetchIAPdata } from '../tasks/fetch-iap-data';
import { login } from '../tasks/login';
import { navigateToIAPs } from '../tasks/navigate-to-iap';
import { navigateToMyApps } from '../tasks/navigate-to-my-apps';
import { parseIAPs } from '../tasks/parse-iap';
import { pushToSpreadsheet } from '../tasks/push-to-spreadsheet';

const fetchData = async (page: Page, config: AppStoreConnectConfig) => {
  const { app, credentials } = config;

  meter.start();

  // Signing In
  logger.init('Signing in');
  await login(page, credentials);
  logger.finish('Signing in');

  // Navigating to apps list
  logger.init('Navigating to apps list');
  await navigateToMyApps(page);
  logger.finish('Navigating to apps list');

  // Navigating to IAPs list
  logger.init('Navigating to IAPs list');
  await navigateToIAPs(page, app.id);
  logger.finish('Navigating to IAPs list');

  // Parsing IAPs list
  logger.init('Parsing IAPs list');
  const items = await parseIAPs(page);
  logger.finish('Parsing IAPs list');

  // Cleaning existing Spreadsheet
  logger.init('Cleaning existing Spreadsheet');
  await cleanupSpreadsheet();
  logger.finish('Cleaning existing Spreadsheet');

  // Iterating results
  let proccessedItems = 0;

  for (const item of items) {
    // Fetching item
    logger.init(`Fetching item: ${item.name}`);
    const result = await fetchIAPdata(page, item);
    logger.finish(`Fetching item: ${item.name}`);

    // Pushing to Google Sheets
    logger.init(`Pushing to Google Sheets: ${item.name}`);
    await pushToSpreadsheet(result);
    logger.finish(`Pushing item to Google Sheets: ${item.name}`);

    // Incrementing the counter
    proccessedItems++;
  }

  const { time } = meter.stop();
  logger.info(`Fetched ${proccessedItems} items in ${time}s. 🤓`);
};

export { fetchData };
