import { Dictionary } from '../util/object';

type DecodeFunction = (val: string) => string;

interface CookieParseOptions {
  decode?: DecodeFunction;
}

interface CookieParseResult {
  [key: string]: string;
}

const decode = decodeURIComponent;

const pairSplitRegExp = /; */;

const performDecoding = (str: string, decode: DecodeFunction) => {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
};

const parse = (
  str: string,
  options?: CookieParseOptions
): CookieParseResult => {
  const obj = {} as Dictionary;
  const opt = options || {};
  const pairs = str.split(pairSplitRegExp);
  const dec = opt.decode || decode;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    let eq_idx = pair.indexOf('=');

    if (eq_idx < 0) {
      continue;
    }

    const key = pair.substr(0, eq_idx).trim();
    let val = pair.substr(++eq_idx, pair.length).trim();

    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    if (undefined == obj[key]) {
      obj[key] = performDecoding(val, dec);
    }
  }

  return obj;
};

export { parse };
