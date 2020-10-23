export interface SEO {
  title: string;
  description: string;
}

export interface InitialData<T = any> {
  pageData: T | null;
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
