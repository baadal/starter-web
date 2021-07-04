import { RouteInfo } from 'starter/core/model/route.model';
import { StringIndexable } from 'model/common.model';

const routes: StringIndexable<RouteInfo> = {
  about: {
    path: '/about',
    source: '/v1/data/about',
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

export default routes;
