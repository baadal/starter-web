import path from 'path';

import store from '../lib/store';
import { readFile, writeFile, appendToFile, deleteDir } from '../lib/file-io';
import { AllAssetsMap } from '../core/model/common.model';
import logger from './logger';

// const sleep = require('system-sleep');

const assetMap: AllAssetsMap = {
  main: '',
  images: [],
  css: [],
  fonts: [],
  compressed: [],
  rest: [],
};

const displayAssets = (isServer: boolean) => {
  store.assetList.forEach((asset: string) => {
    const item = asset.substr(asset.lastIndexOf('/') + 1);
    if ((isServer && item === 'index.js') || (!isServer && /^client.+js$/.test(item))) {
      assetMap.main = asset;
    } else if (/\.(png|jpe?g|gif|svg|ico)$/.test(item)) {
      assetMap.images.push(asset);
    } else if (/\.css$/.test(item)) {
      assetMap.css.push(asset);
    } else if (/\.(ttf|woff2?)$/.test(item)) {
      assetMap.fonts.push(asset);
    } else if (/\.(gz|br)$/.test(item)) {
      assetMap.compressed.push(asset);
    } else if (/\.(txt|map)$/.test(item)) {
      // ignore
    } else {
      assetMap.rest.push(asset);
    }
  });

  console.log();
  const mainItem = assetMap.main.substr(assetMap.main.lastIndexOf('/') + 1);
  logger.log_(mainItem);
  if (assetMap.images.length > 0) {
    logger.warn_(`images (${assetMap.images.length})`);
  }
  if (assetMap.css.length > 0) {
    logger.warn_(`css (${assetMap.css.length})`);
  }
  if (assetMap.fonts.length > 0) {
    logger.warn_(`fonts (${assetMap.fonts.length})`);
  }
  if (assetMap.compressed.length > 0) {
    logger.warn_(`compressed (${assetMap.compressed.length})`);
  }
  console.log();
  assetMap.rest.sort();
  assetMap.rest.forEach(asset => {
    const item = asset.substr(asset.lastIndexOf('/') + 1);
    logger.cyan(item);
  });
};

const dumpAssetsMap = () => {
  const assetMapPath = path.resolve(process.cwd(), `build/assets-map.json`);
  const assetsMap = {
    images: assetMap.images,
    fonts: assetMap.fonts,
  };
  const assetMapData = JSON.stringify(assetsMap, null, 2);
  writeFile(assetMapPath, assetMapData);
};

export const make = (isServer: boolean) => {
  const files = ['client', 'server', 'done'];

  const clientFile = `build/.event/${files[0]}`;
  const serverFile = `build/.event/${files[1]}`;

  const pathList = [clientFile, serverFile];
  const index = isServer ? 1 : 0;

  const currPath = path.resolve(process.cwd(), pathList[index]);
  const currEmitted = !!readFile(currPath);

  if (currEmitted) writeFile(currPath, '');
};

const syncHelper = (isServer: boolean) => {
  const files = ['client', 'server', 'done'];

  const clientFile = `build/.event/${files[0]}`;
  const serverFile = `build/.event/${files[1]}`;
  const doneFile = `build/.event/${files[2]}`;

  const pathList = [clientFile, serverFile];
  const index = isServer ? 1 : 0;
  const currPath = path.resolve(process.cwd(), pathList[index]);
  const siblingPath = path.resolve(process.cwd(), pathList[1 - index]);

  const donePath = path.resolve(process.cwd(), doneFile);
  const currEmitted = !!readFile(currPath);
  const siblingEmitted = !!readFile(siblingPath);

  if (!currEmitted) {
    writeFile(currPath, `${Date.now()}`);
  }

  if (siblingEmitted) {
    writeFile(donePath, `${Date.now()}`);
  }
};

const eventCleanup = () => {
  const eventEmitDir = path.resolve(process.cwd(), 'build/.event');
  deleteDir(eventEmitDir);
};

export const appendLog = (content: string) => {
  const logPath = path.resolve(process.cwd(), 'build/.event/log');
  appendToFile(logPath, content);
};

export const done = (isServer: boolean) => {
  displayAssets(isServer);
  if (!isServer) dumpAssetsMap();
  syncHelper(isServer);
};

export const run = () => {
  eventCleanup();
};

// const doneStart = (isServer: boolean) => {
//   return syncHelper(isServer, ['client-start', 'server-start', 'done-start']);
// };

export const watchRun = (_isServer?: boolean) => {
  // doneStart(isServer);

  // let doneEmitted = false;
  // do {
  //   sleep(20);
  //   const donePath = path.resolve(process.cwd(), 'build/.event/done-start');
  //   doneEmitted = !!readFile(donePath);
  // } while (!doneEmitted);

  store.cleanup();
};

export const assetEmitted = (file: string, _content: any) => {
  // const sizeBytes = content.length;
  store.addAsset(file);
};
