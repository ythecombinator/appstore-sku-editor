import { Page } from 'puppeteer';

import { config } from './config';
import { appStoreFirstPhase } from './phases';

const { variables } = config;

const appStoreConnectRoutine = async (page: Page) => {
  try {
    await appStoreFirstPhase(page, variables.appStoreConnect);
  } catch (err) {
    console.error(err);
  }
};

export { appStoreConnectRoutine };
