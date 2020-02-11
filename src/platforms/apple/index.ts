import { Page } from 'puppeteer';

import { logger } from '../../util/terminal';
import { Routine } from '../../models/CLI';

import { config } from './config';
import { fetchData, pushData } from './routines';

const { variables } = config;

const appStoreConnectRoutine = async (page: Page, routine: Routine) => {
  try {
    switch (routine) {
      case Routine.fetch: {
        await fetchData(page, variables.appStoreConnect);
        break;
      }
      case Routine.push: {
        await pushData(page, variables.appStoreConnect);
        break;
      }
    }
  } catch (err) {
    logger.error(err);
  }
};

export { appStoreConnectRoutine };
