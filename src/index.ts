import puppeteer from 'puppeteer';

import { appStoreConnectRoutine } from './platforms/apple';
import { logger } from './util/terminal';

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setDefaultTimeout(180000);

  try {
    await appStoreConnectRoutine(page);
  } catch (err) {
    logger.error(err);
  }
};

main();
