import path from 'path';
import UAParser from 'ua-parser-js';

import { readFile } from 'starter/lib/file-io';
import { checkProd } from 'src/utils/env.utils';
import browserMap from 'src/ssr/browser-map';
import { uaParserMap, assetsDataMap, assetsMimeMap, cjsStatsCache, esmStatsCache, cjsToEsmMap } from 'src/ssr/server-state';
import { assertStatsJson, getStatsJson, getFileMimeType } from 'starter/utils';
import { StringIndexable } from 'src/core/models/common.model';
import { DomElem, BrowserInfo, UserAgentInfo } from 'src/core/models/ssr.model';
import logger from 'starter/logger';

const isProd = checkProd();

const publicParts = (url: string) => {
  const publicPath = cjsStatsCache.get('publicPath') || '/';
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

const initStatsCache = (esm?: boolean) => {
  const statsCache = esm ? esmStatsCache : cjsStatsCache;
  const statsJson = getStatsJson(esm);

  const assets =
    statsJson.assets?.map((asset: any) => ({
      name: asset.name,
      chunks: asset.chunks,
      chunkNames: asset.chunkNames,
    })) || [];
  const assetsByChunkName = statsJson.assetsByChunkName || [];
  const publicPath = statsJson.publicPath || '/';

  statsCache.set('publicPath', publicPath);
  statsCache.set('assets', assets);
  statsCache.set('assetsByChunkName', assetsByChunkName);
};

const filterJsMap = (jsMap: StringIndexable<string | string[]>) => {
  const jsMapFilter: StringIndexable<string> = {};
  if (!jsMap) return jsMapFilter;

  Object.entries(jsMap).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value = value.find(file => /\.js$/.test(file)) || '';
    }
    jsMapFilter[`${key}`] = value;
  });

  return jsMapFilter;
};

const initCjsToEsmMap = () => {
  if (!cjsStatsCache.size) {
    logger.error('[initCjsToEsmMap] cjsStatsCache NOT initialized yet!');
  }
  if (!esmStatsCache.size) {
    logger.error('[initCjsToEsmMap] esmStatsCache NOT initialized yet!');
  }

  const cjsFiles = filterJsMap(cjsStatsCache.get('assetsByChunkName'));
  const esmFiles = filterJsMap(esmStatsCache.get('assetsByChunkName'));

  Object.keys(cjsFiles).forEach(key => {
    const cjsFile = cjsFiles[`${key}`];
    if (cjsFile && !cjsToEsmMap.has(cjsFile)) {
      cjsToEsmMap.set(cjsFile, esmFiles[`${key}`]);
    }
  });
};

const initAssetsDataMap = () => {
  const jsAssetList = ['scriptTop', 'scriptBottom'].map(name => cjsStatsCache.get('assetsByChunkName')[name]);
  const styleAssetList = cjsStatsCache
    .get('assets')
    .map((asset: any) => asset.name)
    .filter((assetName: string) => /\.css$/.test(assetName));

  const dataAssetList = [...jsAssetList, ...styleAssetList];
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
    return true;
  }
  return false;
};

const initAssetsMimeMap = async (esm?: boolean) => {
  const statsJson = getStatsJson(esm);
  const assets = statsJson.assets || [];
  const assetNames = assets.map((asset: any) => asset.name);

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
    if (isProd) {
      await assertStatsJson(true);
      initStatsCache(true);
      await initAssetsMimeMap(true);
      initCjsToEsmMap();
    }
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
  if (!assetsDataMap.size) {
    logger.error('[getAssetsData] assetsDataMap NOT initialized yet!');
    return '';
  }

  let urlPath = assetPath;
  if (assetPath.startsWith('http')) {
    const parts = publicParts(assetPath);
    if (!parts) {
      logger.error(`[getAssetsData] Unexpected url: ${assetPath}`);
      return '';
    }
    urlPath = parts.urlPath;
  }

  return assetsDataMap.get(urlPath) || '';
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

export const getMimeType = (urlPath: string) => {
  let mimeType: string | boolean = false;
  if (!assetsMimeMap.size) {
    logger.error('[getMimeType] assetsMimeMap NOT initialized yet!');
    return mimeType;
  }

  if (urlPath && assetsMimeMap.has(urlPath)) {
    mimeType = assetsMimeMap.get(urlPath) || false;
  }

  if (!mimeType) {
    logger.error(`[getMimeType] mimeType NOT found for asset: ${urlPath}`);
  }
  return mimeType;
};

export const injectEsmScripts = (elems: DomElem[], esmSupported: boolean) => {
  if (!esmSupported) {
    return elems;
  }
  if (!cjsToEsmMap.size) {
    logger.error('[injectEsmScripts] cjsToEsmMap NOT initialized yet!');
    return elems;
  }

  const elemsIn: DomElem[] = [];
  elems.forEach(el => {
    if (/\.js$/.test(el.props.src)) {
      const cjsUrl = el.props.src as string;
      const parts = publicParts(cjsUrl);
      if (!parts) {
        logger.error(`[injectEsmScripts] Unexpected url: ${cjsUrl}`);
        elemsIn.push(el);
        return;
      }

      const { pubPath, urlPath } = parts;
      const newUrlPath = cjsToEsmMap.get(urlPath);
      if (!newUrlPath) {
        logger.error(`[injectEsmScripts] No value in cjsToEsmMap for: ${urlPath}`);
        elemsIn.push(el);
        return;
      }

      const esmEl: DomElem = JSON.parse(JSON.stringify(el));
      esmEl.props.src = `${pubPath}${newUrlPath}`;
      // if (esmEl.props.async) delete esmEl.props.async; // delete async attr
      esmEl.props = { type: 'module', ...esmEl.props }; // type = "module"
      elemsIn.push(esmEl);

      const elOrig: DomElem = JSON.parse(JSON.stringify(el));
      elOrig.props = { nomodule: true, ...elOrig.props }; // nomodule
      elemsIn.push(elOrig);
    } else {
      elemsIn.push(el);
    }
  });

  return elemsIn;
};

export const swapEsmLinks = (elems: DomElem[], esmSupported: boolean) => {
  if (!esmSupported) {
    return elems;
  }
  if (!cjsToEsmMap.size) {
    logger.error('[swapEsmLinks] cjsToEsmMap NOT initialized yet!');
    return elems;
  }

  const elemsIn: DomElem[] = [];
  elems.forEach(el => {
    if (/\.js$/.test(el.props.href)) {
      const cjsUrl = el.props.href as string;
      const parts = publicParts(cjsUrl);
      if (!parts) {
        logger.error(`[swapEsmLinks] Unexpected url: ${cjsUrl}`);
        elemsIn.push(el);
        return;
      }

      const { pubPath, urlPath } = parts;
      const newUrlPath = cjsToEsmMap.get(urlPath);
      if (!newUrlPath) {
        logger.error(`[swapEsmLinks] No value in cjsToEsmMap for: ${urlPath}`);
        elemsIn.push(el);
        return;
      }

      const esmEl: DomElem = JSON.parse(JSON.stringify(el));
      esmEl.props.href = `${pubPath}${newUrlPath}`;
      if (esmEl.props.rel === 'preload') esmEl.props.crossorigin = true;

      elemsIn.push(esmEl);
    } else {
      elemsIn.push(el);
    }
  });

  return elemsIn;
};
