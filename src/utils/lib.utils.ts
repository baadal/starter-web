import { StringIndexable } from 'src/core/models/common.model';

export const parseQueryString = (input: string) => {
  const ret: StringIndexable<string> = {};

  if (typeof input !== typeof '') {
    return ret;
  }

  input = input.trim().replace(/^[?#&]/, '');

  if (!input) {
    return ret;
  }

  // eslint-disable-next-line
  for (const param of input.split('&')) {
    const separatorIndex = param.indexOf('=');
    const key = param.slice(0, separatorIndex);
    const value = param.slice(separatorIndex + 1);
    ret[key] = value || '';
  }

  return ret;
};
