import puppeteer from 'puppeteer';
import cliUtils from 'meow';
import { exit } from 'process';

import { appStoreConnectRoutine } from './platforms/apple';
import { logger } from './util/terminal';
import { config } from './config';

// Types
type Flags = typeof cli['flags'];

type Routine = 'fetch' | 'push';

// Helpers
const { constants } = config;

// Main
const main = async (flags: Flags) => {
  const routine = flags.routine as Routine;

  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setDefaultTimeout(constants.defaultTimeout);

  try {
    switch (routine) {
      case 'fetch': {
        await appStoreConnectRoutine(page);
        break;
      }
      case 'push': {
        console.log('push');
        break;
      }
    }
    exit();
  } catch (err) {
    logger.error(err);
    exit(err.code);
  }
};

const cli = cliUtils(
  `
	Usage
	  $ appstore-sku-editor

	Options
	  --routine, -r  Specify wether to 'fetch' or 'push' data

	Examples
	  $ appstore-sku-editor --routine fetch
`,
  {
    flags: {
      routine: {
        type: 'string',
        alias: 'r',
      },
    },
  }
);

main(cli.flags);
