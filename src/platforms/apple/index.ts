import { Page } from 'puppeteer';

import { logger } from '../../util/terminal';
import { Routine } from '../../models/CLI';

import { config } from './config';
import { fetchAppStoreData } from './routines';

const { variables } = config;

const appStoreConnectRoutine = async (page: Page, routine: Routine) => {
  try {
    switch (routine) {
      case Routine.fetch: {
        await fetchAppStoreData(page, variables.appStoreConnect);
        break;
      }
      case Routine.push: {
        logger.info("'Pushing' is not available for 'iOS'");
        break;
      }
    }
  } catch (err) {
    logger.error(err);
  }
};

export { appStoreConnectRoutine };
