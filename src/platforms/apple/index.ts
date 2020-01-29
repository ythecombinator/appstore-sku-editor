import { Page } from 'puppeteer';

import { config } from './config';
import { AppStoreConnectCredentials } from './models/AppStoreConnectCredentials';
import { appStoreFirstPhase } from './phases';

const { variables } = config;
const credentials = variables.appStoreConnect as AppStoreConnectCredentials;

const appStoreConnectRoutine = async (page: Page) => {
  try {
    await appStoreFirstPhase(page, credentials);
  } catch (err) {
    console.error(err);
  }
};

export { appStoreConnectRoutine };
