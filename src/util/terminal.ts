import readline from 'readline';
import { green, cyan, blue, red } from 'chalk';
import cliUtils from 'meow';

// CLI

const prompt = (message: string): Promise<string> => {
  const promptInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  return new Promise(resolve => {
    promptInterface.question(message, answer => {
      resolve(answer);
    });
  });
};

const cli = cliUtils(
  `
	${blue.bold('Usage')}
	  $ yarn start

  ${blue.bold('Options')}
    --platform, -p  Specify wether to connect to App Store ('ios') or Play Store ('android')
    --routine, -r   Specify wether to 'fetch' or 'push' data

  ${blue.bold('Examples')}
	  $ yarn start --platform ios --routine fetch
`,
  {
    flags: {
      routine: {
        type: 'string',
        alias: 'r',
      },
      platform: {
        type: 'string',
        alias: 'p',
      },
    },
  }
);

// Logger

const { log } = console;

const init = (message: string) => {
  log('\n');
  log(cyan.bgBlack.bold('STARTED'), message);
};

const finish = (message: string) => {
  log(green.bgBlack.bold('FINISHED'), message);
  log('\n');
};

const info = (message: string) => {
  log('\n');
  log(blue.bold(message));
  log('\n');
};

const error = (message: string) => {
  log('\n');
  log(red.bold(message));
  log('\n');
};

const logger = {
  init,
  finish,
  info,
  error,
};

export { prompt, cli, logger };
