import { StringIndexable } from './common.model';

export interface DomElem {
  type: string;
  props: StringIndexable<any>;
}

export type StyleElem = DomElem;

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
