import UAParser from 'ua-parser-js';

import { BrowserInfo, UserAgentInfo } from 'src/core/models/ssr.model';

export const getUserAgentInfo = (userAgent: string): UserAgentInfo | null => {
  if (!userAgent) return null;

  const parser = new UAParser(userAgent);
  const browser: BrowserInfo = parser.getBrowser();

  return { browser };
};
