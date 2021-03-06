import { RouteComponentProps } from 'react-router-dom';

export interface PropsRoot extends RouteComponentProps {}

export interface StringIndexable<T = any> {
  [key: string]: T;
}

export interface EnvValues extends StringIndexable<string> {
  port: string;
  portApi: string;
  apiBaseUrl: string;
  apiBasePublicUrl: string;
  assetsBaseUrl: string;
}

export interface GenericRequest {
  url: string;
  path: string;
  route: { path: string };
  query?: StringIndexable<any>;
  params?: any;
}

export interface AllAssetsMap {
  main: string;
  images: string[];
  css: string[];
  fonts: string[];
  compressed: string[];
  rest: string[];
}

export interface AssetsMap {
  common: string[];
  images: string[];
  fonts: string[];
}
