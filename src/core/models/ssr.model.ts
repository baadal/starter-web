export interface BrowserInfo {
  name?: string;
  version?: string;
  major?: string;
  label?: string;
}

export interface UserAgentInfo {
  browser: BrowserInfo;
  osName: string;
  isMobile: boolean;
}
