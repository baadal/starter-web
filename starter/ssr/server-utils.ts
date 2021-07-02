import path from 'path';
import UAParser from 'ua-parser-js';

import { readFile } from 'starter/lib/file-io';
import browserMap from 'starter/ssr/browser-map';
import { uaParserMap, assetsDataMap, assetsMimeMap, cjsStatsCache, etcStatsCache } from 'starter/ssr/server-state';
import { assertStatsJson, getStatsJson, getFileMimeType } from 'starter/utils/utils';
import { AssetsMap } from 'starter/core/model/common.model';
import { BrowserInfo, UserAgentInfo } from 'starter/core/model/ssr.model';
import logger from 'starter/utils/logger';

export const getPublicPath = () => {
  return cjsStatsCache.get('publicPath') || '/';
};

const publicParts = (url: string) => {
  const publicPath = getPublicPath();
  if (!url?.startsWith(publicPath)) {
    return null;
  }

  const pubPath = publicPath;
  const urlPath = url.substr(publicPath.length);
  return { pubPath, urlPath };
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

  const assetsMap: AssetsMap = {
    common: ['scriptTop.js', 'scriptBottom.js'],
  };
  etcStatsCache.set('assetsMap', assetsMap);
};

const getAssetNames = () => {
  const assetList = Object.values(cjsStatsCache.get('assetsByChunkName') || {}).flat() as string[];
  return assetList;
};

export const getAssetList = () => {
  const assetList = getAssetNames();
  const publicPath = cjsStatsCache.get('publicPath');
  return assetList.map(asset => `${publicPath}${asset}`);
};

const initAssetsDataMap = () => {
  const assetList = getAssetNames();
  const styleAssetList = assetList.filter(assetName => /\.css$/.test(assetName));

  const assetsMap: AssetsMap = etcStatsCache.get('assetsMap') || {};
  const jsAssetList = assetsMap.common;

  const dataAssetList = [...styleAssetList, ...jsAssetList];
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

export const getAssetsData = (assetPath: string) => {
  if (!assetsDataMap.size) {
    logger.error('[getAssetsData] assetsDataMap NOT initialized yet!');
    return '';
  }

  let urlPath = assetPath;
  if (assetPath.startsWith('/') || /^https?:/.test(assetPath)) {
    const parts = publicParts(assetPath);
    if (!parts) {
      logger.error(`[getAssetsData] Unexpected url: ${assetPath}`);
      return '';
    }
    urlPath = parts.urlPath;
  }

  return assetsDataMap.get(urlPath) || '';
};

const getCaniuseName = (uaParseName: string, android?: boolean) => {
  let label = '';
  if (!uaParserMap.size) {
    logger.error('[getCaniuseName] uaParserMap NOT initialized yet!');
    return label;
  }

  if (uaParseName) {
    let uaparseKey = uaParseName.toLowerCase().split(' ').join('-');
    if (!uaParserMap.has(uaparseKey)) {
      uaparseKey = android ? `${uaparseKey}:android` : `${uaparseKey}:!android`;
    }
    if (uaParserMap.has(uaparseKey)) {
      const browserMapKey = uaParserMap.get(uaparseKey);
      const { caniuse } = browserMap[`${browserMapKey}`];
      label = [caniuse].flat()[0] as string;
    }
  }

  if (!label) {
    logger.warn('[getCaniuseName] Browser label NOT defined!');
  }
  return label;
};

export const getUserAgentInfo = (userAgent: string): UserAgentInfo | null => {
  if (!userAgent) return null;

  const parser = new UAParser(userAgent);

  let browser: BrowserInfo = parser.getBrowser();
  const device = parser.getDevice();
  const os = parser.getOS();

  const osName = os.name || '';
  const deviceType = device.type?.toLowerCase() || '';
  const isMobile = deviceType.includes('mobile') || deviceType.includes('tablet');
  const android = isMobile && osName.toLowerCase() === 'android';

  const browserName = browser?.name || '';
  const label = getCaniuseName(browserName, android);
  browser = { ...browser, label };

  return { browser, osName, isMobile };
};
