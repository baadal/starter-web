import fs from 'fs';
import rimraf from 'rimraf';

import logger from '../logger';

export const existsFile = (file: string, silent = false) => {
  try {
    if (!fs.existsSync(file)) {
      if (silent) return '';
      throw new Error(`[ERROR] File does not exist: ${file}`);
    }
  } catch (e) {
    if (silent) return '';
    throw new Error(`Error while accessing file: ${file}`);
  }
  return file;
};

export const readFile = (file: string, warn = false) => {
  let contents = null;
  try {
    contents = fs.readFileSync(file, 'utf8');
  } catch (e) {
    if (warn) logger.warn(`Cannot read file: ${file}`);
  }
  return contents;
};

export const writeFile = (file: string, contents: string) => {
  try {
    const pos = file.lastIndexOf('/');
    const dir = file.substring(0, pos);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, contents);
  } catch (e) {
    logger.error(`ERROR while writing to ${file}`, e);
  }
};

export const appendToFile = (file: string, contents: string) => {
  try {
    const pos = file.lastIndexOf('/');
    const dir = file.substring(0, pos);
    fs.mkdirSync(dir, { recursive: true });

    fs.appendFileSync(file, contents + '\n');

    // Ref: https://stackoverflow.com/a/43370201
    // const stream = fs.createWriteStream(file, { flags: 'a' });
    // stream.write(contents + '\n');
    // stream.end();
  } catch (e) {
    logger.error(`ERROR while appending to ${file}`, e);
  }
};

export const deleteDir = (dir: string) => {
  if (!dir) return;
  try {
    rimraf.sync(dir);
  } catch (e) {
    logger.error(`ERROR while deleting dir ${dir}`, e);
  }
};
