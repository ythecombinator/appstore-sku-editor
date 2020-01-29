import { Page } from 'puppeteer';
import { config } from '../config';

const { appBaseURL } = config.constants.appStoreConnect;

const navigateToIAPs = async (page: Page, id: string) => {
  await page.goto(`${appBaseURL}/${id}/addons`);
};

export { navigateToIAPs };
