import path from 'path';
import UAParser from 'ua-parser-js';

import { readFile } from 'starter/lib/file-io';
import browserMap from 'src/ssr/browser-map';
import { uaParserMap, assetsDataMap, assetsMimeMap, cjsStatsCache } from 'src/ssr/server-state';
import { assertStatsJson, getStatsJson, getFileMimeType, urlParts } from 'starter/utils';
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

export const getJsAssetName = (chunkName: string) => {
  if (!cjsStatsCache.size) {
    logger.error('[getJsAssetName] cjsStatsCache NOT initialized yet!');
    return '';
  }

  let asset = cjsStatsCache.get('assetsByChunkName')[chunkName];
  if (Array.isArray(asset)) {
    asset = asset.find(t => /\.js$/.test(t));
  }
  return asset || '';
};

export const getAssetsData = (assetPath: string) => {
  const { pathname } = urlParts(assetPath);
  if (!assetsDataMap.size) {
    logger.error('[getAssetsData] assetsDataMap NOT initialized yet!');
    return '';
  }
  return assetsDataMap.get(pathname) || '';
};

export const getFontList = () => {
  if (!cjsStatsCache.size) {
    logger.error('[getFontList] cjsStatsCache NOT initialized yet!');
    return [];
  }
  const fontList = cjsStatsCache
    .get('assets')
    .map((f: any) => f.name)
    .filter((f: any) => /\.(ttf|woff2?)/.test(f));
  return (fontList || []) as string[];
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

export const getMimeType = (reqUrl: string) => {
  let mimeType: string | boolean = false;
  if (!assetsMimeMap.size) {
    logger.error('[getMimeType] assetsMimeMap NOT initialized yet!');
    return mimeType;
  }

  if (reqUrl && assetsMimeMap.has(reqUrl)) {
    mimeType = assetsMimeMap.get(reqUrl) || false;
  }

  if (!mimeType) {
    logger.error(`[getMimeType] mimeType NOT found for asset: ${reqUrl}`);
  }
  return mimeType;
};
