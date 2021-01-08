import path from 'path';
import FileType from 'file-type';
import mime from 'mime-types';

import { existsFile, readFile } from 'starter/lib/file-io';

export const getStatsJson = (esm?: boolean) => {
  const statsFile = `build/loadable-stats${esm ? '.esm' : ''}.json`;
  const statsFilePath = existsFile(path.resolve(process.cwd(), statsFile));
  const stats = readFile(statsFilePath, true) || '{}';
  return JSON.parse(stats);
};

export const getAssetsJson = () => {
  const assetsFile = `build/assets-map.json`;
  const assetsFilePath = existsFile(path.resolve(process.cwd(), assetsFile));
  const assets = readFile(assetsFilePath, true) || '{}';
  return JSON.parse(assets);
};

export const assertStatsJson = async (esm?: boolean) => {
  const statsFile = `build/loadable-stats${esm ? '.esm' : ''}.json`;
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
