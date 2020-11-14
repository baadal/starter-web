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

export interface NotFoundPageData extends PageDataRoot {
  message: string;
}
