import { cli } from '../util/terminal';

type Flags = typeof cli['flags'];

enum Routine {
  fetch = 'fetch',
  push = 'push',
}

enum Platform {
  android = 'android',
  ios = 'ios',
}

export { Flags, Routine, Platform };
