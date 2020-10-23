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
