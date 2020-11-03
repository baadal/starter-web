export interface SEO {
  title: string;
  description: string;
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

export interface FibonacciData extends PageDataRoot {
  n: string;
  fn: string;
}
