import path from 'path';
import UAParser from 'ua-parser-js';

import { readFile } from 'starter/lib/file-io';
import browserMap from 'starter/ssr/browser-map';
import { uaParserMap, assetsDataMap, assetsMimeMap, cjsStatsCache, etcStatsCache } from 'starter/ssr/server-state';
import { assertStatsJson, getStatsJson, getFileMimeType } from 'starter/utils/utils';
import { BrowserInfo, UserAgentInfo } from 'starter/core/model/ssr.model';
import logger from 'starter/utils/logger';

export const getPublicPath = () => {
  return cjsStatsCache.get('publicPath') || '/';
};

const initUaParserMap = () => {
  Object.entries(browserMap).forEach(([key, value]) => {
    const uaparsedValues: string[] = [value.uaparse].flat();
    uaparsedValues.forEach(uaparse => {
      let uaparseKey = uaparse;
      if (value.cond) {
        if (value.cond.android) uaparseKey += ':android';
        else uaparseKey += ':!android';
      }
      uaparseKey = uaparseKey.toLowerCase().split(' ').join('-');
      uaParserMap.set(uaparseKey, key);
    });
  });
};

const initStatsCache = () => {
  const statsCache = cjsStatsCache;
  const statsJson = getStatsJson();

  const assetsByChunkName = statsJson.assetsByChunkName || {};
  statsCache.set('assetsByChunkName', assetsByChunkName);

  const publicPath = statsJson.publicPath || '/';
  statsCache.set('publicPath', publicPath);

  const assetsMap = {};
  etcStatsCache.set('assetsMap', assetsMap);
};

const initAssetsDataMap = () => {
  const assetList = Object.values(cjsStatsCache.get('assetsByChunkName') || {}).flat() as string[];
  const styleAssetList = assetList.filter(assetName => /\.css$/.test(assetName));

  const dataAssetList = [...styleAssetList];
  dataAssetList.forEach((assetName: string) => {
    const assetFile = path.resolve(process.cwd(), `build/public/${assetName}`);
    const assetData = readFile(assetFile) || '';
    assetsDataMap.set(assetName, assetData);
  });
};

const cacheMimeType = async (assetName: string) => {
  const filename = path.resolve(process.cwd(), `build/public/${assetName}`);
  const mimeType = await getFileMimeType(filename);
  if (mimeType) {
    assetsMimeMap.set(assetName, mimeType);
    return mimeType;
  }
  return '';
};

const initAssetsMimeMap = async () => {
  const statsJson = getStatsJson();
  const assets = Object.values(statsJson.assetsByChunkName || {}).flat();

  const assetNames = [...assets] as string[];

  const prList: Promise<string>[] = [];
  assetNames.forEach(assetName => prList.push(cacheMimeType(assetName)));
  await Promise.all(prList);
};

export const initWebServer = async () => {
  try {
    await assertStatsJson();
    initUaParserMap();
    initStatsCache();
    initAssetsDataMap();
    await initAssetsMimeMap();
  } catch (e) {
    logger.warn('~~~~~~~~~~~~~~~~~~~');
    logger.error(e.message);
    logger.warn('~~~~~~~~~~~~~~~~~~~');
  }
};

export const initApiServer = () => {
  initUaParserMap();
};

export const getUserAgentInfo = (userAgent: string): UserAgentInfo | null => {
  if (!userAgent) return null;

  const parser = new UAParser(userAgent);
  const browser: BrowserInfo = parser.getBrowser();

  return { browser };
};
