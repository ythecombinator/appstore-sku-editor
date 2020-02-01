import { Page } from 'puppeteer';

import { config } from './config';
import { fetchAppStoreData } from './routines';

const { variables } = config;

const appStoreConnectRoutine = async (page: Page) => {
  try {
    await fetchAppStoreData(page, variables.appStoreConnect);
  } catch (err) {
    console.error(err);
  }
};

export { appStoreConnectRoutine };
