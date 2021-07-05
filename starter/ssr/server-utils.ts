import UAParser from 'ua-parser-js';

import { BrowserInfo, UserAgentInfo } from 'starter/core/model/ssr.model';

export const getUserAgentInfo = (userAgent: string): UserAgentInfo | null => {
  if (!userAgent) return null;

  const parser = new UAParser(userAgent);
  const browser: BrowserInfo = parser.getBrowser();

  return { browser };
};
