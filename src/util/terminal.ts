import readline from 'readline';
import { green, cyan, blue, red } from 'chalk';

const { log } = console;

const prompt = (message: string) => {
  const promptInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    promptInterface.question(message, answer => {
      resolve(answer);
    });
  });
};

// Logger

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

export { prompt, logger };
