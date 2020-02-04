import { Page } from 'puppeteer';

import { config } from './config';
import { fetchAppStoreData } from './routines';
import { logger } from '../../util/terminal';

const { variables } = config;

const appStoreConnectRoutine = async (page: Page) => {
  try {
    await fetchAppStoreData(page, variables.appStoreConnect);
  } catch (err) {
    logger.error(err);
  }
};

export { appStoreConnectRoutine };
