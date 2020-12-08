import path from 'path';
import FileType from 'file-type';
import mime from 'mime-types';

import { existsFile, readFile } from './lib/file-io';

export const getStatsJson = () => {
  const statsFile = `build/loadable-stats.json`;
  const statsFilePath = existsFile(path.resolve(process.cwd(), statsFile));
  const stats = readFile(statsFilePath, true) || '{}';
  return JSON.parse(stats);
};

export const assertStatsJson = async () => {
  const statsFile = `build/loadable-stats.json`;
  const statsFilePath = path.resolve(process.cwd(), statsFile);
  for (let i = 0; i < 30; i += 1) {
    if (existsFile(statsFilePath, true)) return;
    await new Promise(resolve => setTimeout(resolve, 100)); // eslint-disable-line no-await-in-loop
  }
  throw new Error(`Stats file does not exist: ${statsFile}`);
};

export const getFileMimeType = async (filename: string) => {
  let mimeType: string | false = false;

  try {
    const fileType = await FileType.fromFile(filename);
    mimeType = fileType?.mime || false;
  } catch (e) {} // eslint-disable-line

  if (!mimeType) {
    mimeType = mime.contentType(path.extname(filename));
  }

  return mimeType;
};

export const urlParts = (url: string) => {
  let origin = '';
  let pathname = url || '';
  if (url.startsWith('http')) {
    const urlObj = new URL(url);
    origin = urlObj.origin || '';
    pathname = urlObj.pathname || '';
  }
  return { origin, pathname };
};
