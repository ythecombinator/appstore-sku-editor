import { Page } from 'puppeteer';

import { AppStoreConnectConfig } from '../models/AppStoreConnectConfig';
import { login } from '../tasks/login';
import { navigateToMyApps } from '../tasks/navigate-to-my-apps';
import { navigateToIAPs } from '../tasks/navigate-to-iap';
import { parseIAPs } from '../tasks/parse-iap';
import { fetchIAPdata } from '../tasks/fetch-iap-data';

const firstPhase = async (page: Page, config: AppStoreConnectConfig) => {
  const { app, credentials } = config;

  await login(page, credentials);
  await navigateToMyApps(page);
  await navigateToIAPs(page, app.id);
  const items = await parseIAPs(page);
  const data = await fetchIAPdata(page, items[0]);

  console.log(data);
};

export { firstPhase };
