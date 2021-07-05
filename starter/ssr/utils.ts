import semver from 'semver';
import * as lite from 'caniuse-lite';

import { StringIndexable } from 'starter/core/model/common.model';
import { UserAgentInfo } from 'starter/core/model/ssr.model';
import logger from 'starter/utils/logger';

const getBrowserSemVer = (browserVersion: string) => {
  if (!browserVersion) return '';

  // :: browserVersion formats [ua-parser-js]
  // Chrome: 79.0.3945.88
  // Edge: 87.0.664.41
  // Firefox: 84.0
  // Safari: 14.0.1

  const vMajorMinor = browserVersion.split(' ')[0].split('.').splice(0, 2);
  const vstatus = vMajorMinor.map(p => !isNaN(parseInt(p, 10))).reduce((a, b) => a && b); // eslint-disable-line
  if (!vstatus) return '';

  let semVer;
  if (vMajorMinor.length === 1) {
    semVer = `${vMajorMinor[0]}.0.0`;
  } else {
    semVer = `${vMajorMinor[0]}.${vMajorMinor[1]}.0`;
  }

  return semVer;
};

export const checkESModulesSupport = (userAgentInfo: UserAgentInfo | null) => {
  const browserVersion = userAgentInfo?.browser?.version || '';
  const browserLabel = userAgentInfo?.browser?.label || '';
  const browserSemVer = getBrowserSemVer(browserVersion);

  if (!browserLabel || !browserSemVer) {
    logger.error(`[checkESModulesSupport] Missing argument: browserLabel(${browserLabel}), browserSemVer(${browserSemVer})`);
    return false;
  }

  const feature = lite.features['es6-module'];
  const { stats } = lite.feature(feature);

  const browserStatsReadOnly = stats[`${browserLabel}`];
  if (!browserStatsReadOnly) {
    logger.error(`[checkESModulesSupport] Invalid browserLabel: ${browserLabel}`);
    return false;
  }

  // TODO: Use build-time Cache/Map
  const browserStats: StringIndexable<string> = JSON.parse(JSON.stringify(browserStatsReadOnly));

  // ES modules support: Custom-added rules/stats
  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#browser_support
  if (browserLabel === 'and_chr') {
    if (!browserStats['61']) browserStats['61'] = 'y';
  } else if (browserLabel === 'and_ff') {
    if (!browserStats['60']) browserStats['60'] = 'y';
  }

  let support = '';

  const version = semver.parse(browserSemVer);
  if (version) {
    let shortVersion = `${version?.major}.${version?.minor}`;
    if (browserStats[`${shortVersion}`]) {
      support = browserStats[`${shortVersion}`];
    } else if (version?.minor === 0) {
      shortVersion = `${version?.major}`;
      if (browserStats[`${shortVersion}`]) {
        support = browserStats[`${shortVersion}`];
      }
    }
  }

  if (!support) {
    const versionList: StringIndexable<string> = {};
    Object.entries(browserStats).forEach(([key, value]) => {
      if (value && value[0] === 'y') {
        versionList[`${key.split('-')[0]}`] = value;
      }
    });
    Object.entries(versionList).every(([key, value]) => {
      const semVer = getBrowserSemVer(key);
      if (semVer && semver.lte(semVer, browserSemVer) && value[0] === 'y') {
        support = 'y';
        return false;
      }
      return true;
    });
  }

  return !!(support && support[0] === 'y');
};
