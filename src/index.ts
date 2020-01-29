import puppeteer from 'puppeteer';

import { appStoreConnectRoutine } from './platforms/apple';

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  try {
    await appStoreConnectRoutine(page);
  } catch (err) {
    console.error(err);
  }
};

main();
