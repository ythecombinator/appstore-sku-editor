import puppeteer from 'puppeteer';

import { appStoreConnectRoutine } from './platforms/apple';

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setDefaultTimeout(180000);

  try {
    await appStoreConnectRoutine(page);
  } catch (err) {
    console.error(err);
  }
};

main();
