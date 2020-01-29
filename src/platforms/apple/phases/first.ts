import { Page } from 'puppeteer';

import { AppStoreConnectCredentials } from '../models/AppStoreConnectCredentials';
import { login } from '../tasks/login';
import { navigateToMyApps } from '../tasks/navigate-to-my-apps';

const firstPhase = async (
  page: Page,
  credentials: AppStoreConnectCredentials
) => {
  // Opens
  await login(page, credentials);
  await navigateToMyApps(page);
};

export { firstPhase };
