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
