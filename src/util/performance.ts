import prettyHrtime from 'pretty-hrtime';
import { Indexed } from './object';

const namedPerformances = {} as Indexed<any>;
const defaultName = 'default';

const start = (name = defaultName) => {
  namedPerformances[name] = {
    startAt: process.hrtime(),
  };
};

const stop = (name = defaultName) => {
  const startAt = namedPerformances[name] && namedPerformances[name].startAt;
  if (!startAt) throw new Error(`Namespace: ${name} doesnt exist`);
  const diff = process.hrtime(startAt);
  const time = diff[0] * 1e3 + diff[1] * 1e-6;
  const words = prettyHrtime(diff);
  const preciseWords = prettyHrtime(diff, { precise: true });
  const verboseWords = prettyHrtime(diff, { verbose: true });

  return {
    time: Math.floor(time / 1000),
    words,
    preciseWords,
    verboseWords,
  };
};

const meter = { start, stop };

export { meter };
