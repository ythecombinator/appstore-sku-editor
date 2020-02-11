import puppeteer from 'puppeteer';
import { exit } from 'process';

import { appStoreConnectRoutine } from './platforms/apple';
import { logger, cli } from './util/terminal';
import { Flags, Routine, Platform } from './models/CLI';

import { config } from './config';

// Helpers
const { constants } = config;

// Main
const main = async (flags: Flags) => {
  const routine = flags.routine as Routine;
  const platform = flags.platform as Platform;

  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setDefaultTimeout(constants.defaultTimeout);

  try {
    switch (platform) {
      case Platform.ios: {
        await appStoreConnectRoutine(page, routine);
        break;
      }
      case Platform.android: {
        logger.info("'Android' is not available");
        break;
      }
    }
    exit();
  } catch (err) {
    logger.error(err);
    exit(err.code);
  }
};

main(cli.flags);
