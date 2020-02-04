import puppeteer from 'puppeteer';

import { appStoreConnectRoutine } from './platforms/apple';
import { logger } from './util/terminal';
import { config } from './config';

const { constants } = config;

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setDefaultTimeout(constants.defaultTimeout);

  try {
    await appStoreConnectRoutine(page);
  } catch (err) {
    logger.error(err);
  }
};

main();
