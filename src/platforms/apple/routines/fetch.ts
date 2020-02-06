import { Page } from 'puppeteer';

import { meter } from '../../../util/performance';
import { logger } from '../../../util/terminal';
import { AppStoreConnectConfig } from '../models/AppStoreConnectConfig';
import { InAppPurchase } from '../models/InAppPurchase';
import { fetchIAPdata } from '../tasks/fetch-iap-data';
import { login } from '../tasks/login';
import { navigateToIAPs } from '../tasks/navigate-to-iap';
import { navigateToMyApps } from '../tasks/navigate-to-my-apps';
import { parseIAPs } from '../tasks/parse-iap';
import { pushToGoogleSheets } from '../tasks/push-to-google-sheets';

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

  // Iterating results
  const results = [] as InAppPurchase[];

  for (const item of items) {
    logger.init(`Fetching item: ${item.name}`);
    const result = await fetchIAPdata(page, item);
    results.push(result);
    logger.finish(`Fetching item: ${item.name}`);
  }

  // Pushing to Google Sheets
  logger.init('Pushing to Google Sheets');
  await pushToGoogleSheets(results);
  logger.finish('Pushing to Google Sheets');

  const { time } = meter.stop();
  logger.info(`Fetched ${results.length} items in ${time}s. 🤓`);
};

export { fetchData };
