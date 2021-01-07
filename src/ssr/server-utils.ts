import path from 'path';
import UAParser from 'ua-parser-js';

import { readFile } from 'starter/lib/file-io';
import browserMap from 'src/ssr/browser-map';
import { uaParserMap, assetsDataMap, assetsMimeMap, cjsStatsCache } from 'src/ssr/server-state';
import { assertStatsJson, getStatsJson, getFileMimeType } from 'starter/utils';
import { BrowserInfo, UserAgentInfo } from 'src/core/models/ssr.model';
import logger from 'starter/logger';

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

  const assets =
    statsJson.assets?.map((asset: any) => ({
      name: asset.name,
      chunks: asset.chunks,
      chunkNames: asset.chunkNames,
    })) || [];
  const assetsByChunkName = statsJson.assetsByChunkName || [];

  statsCache.set('assets', assets);
  statsCache.set('assetsByChunkName', assetsByChunkName);
};

const initAssetsDataMap = () => {
  const jsAssetList = ['scriptTop', 'scriptBottom'].map(name => cjsStatsCache.get('assetsByChunkName')[name]);
  const styleAssetList = cjsStatsCache
    .get('assets')
    .map((asset: any) => asset.name)
    .filter((assetName: string) => /\.css$/.test(assetName));

  const dataAssetList = [...jsAssetList, ...styleAssetList].map(item => `/${item}`);
  dataAssetList.forEach((assetName: string) => {
    const assetFile = path.resolve(process.cwd(), `build/public${assetName}`);
    const assetData = readFile(assetFile) || '';
    assetsDataMap.set(assetName, assetData);
  });
};

const cacheMimeType = async (assetName: string) => {
  const filename = path.resolve(process.cwd(), `build/public${assetName}`);
  const mimeType = await getFileMimeType(filename);
  if (mimeType) {
    assetsMimeMap.set(assetName, mimeType);
    return true;
  }
  return false;
};

const initAssetsMimeMap = async () => {
  const statsJson = getStatsJson();
  const assets = statsJson.assets || [];
  const assetNames = assets.map((asset: any) => `/${asset.name}`);

  const prList: Promise<boolean>[] = [];
  assetNames.forEach((assetName: string) => prList.push(cacheMimeType(assetName)));
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
