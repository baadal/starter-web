export interface BrowserInfo {
  name?: string;
  version?: string;
  major?: string;
}

export interface UserAgentInfo {
  browser: BrowserInfo;
}
