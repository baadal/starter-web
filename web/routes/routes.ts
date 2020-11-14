import { RouteInfo } from 'starter/core/model/route.model';
import { StringIndexable } from 'model/common.model';

const routes: StringIndexable<RouteInfo> = {
  about: {
    path: '/about',
    source: '/v1/data/about',
  },
  cssStylesDemo: {
    path: '/demo/css-styles',
    source: '/v1/data/demo/css-styles',
  },
  home: {
    path: '/',
    source: '/v1/data/home',
  },
  default: {
    name: 'NOT_FOUND',
    path: '/*',
    source: '/v1/data/not-found',
  },
};

export const headerSource = '/v1/data/header';
export const footerSource = '/v1/data/footer';

export default routes;
