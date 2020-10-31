export interface SEO {
  title: string;
  description: string;
}

export interface InitialData<T = any> {
  pageData: T | null;
  headerData: any;
  footerData: any;
}

export interface ServerResponse<T = any> {
  status: 'ok' | 'error';
  errorCode?: number;
  errorMsg?: string;
  data: T;
}

export interface PageDataRoot {
  title: string;
  description: string;
  seo: SEO;
}

export type HomePageData = PageDataRoot;
export type AboutPageData = PageDataRoot;
export type CssStylesDemoData = PageDataRoot;
export type CssInJsDemoData = PageDataRoot;

export interface NotFoundPageData extends PageDataRoot {
  message: string;
}

export interface StateStoreDemoData extends PageDataRoot {
  timestamp: string;
}
