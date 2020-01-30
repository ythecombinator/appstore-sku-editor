import { Page } from 'puppeteer';

import { AppStoreConnectConfig } from '../models/AppStoreConnectConfig';
import { login } from '../tasks/login';
import { navigateToMyApps } from '../tasks/navigate-to-my-apps';
import { navigateToIAPs } from '../tasks/navigate-to-iap';
import { parseIAPs } from '../tasks/parse-iap';

const firstPhase = async (page: Page, config: AppStoreConnectConfig) => {
  const { app, credentials } = config;

  await login(page, credentials);
  await navigateToMyApps(page);
  await navigateToIAPs(page, app.id);
  await parseIAPs(page);
};

export { firstPhase };
