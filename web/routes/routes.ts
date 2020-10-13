import { RouteInfo } from 'starter/core/model/route.model';
import { StringIndexable } from 'model/common.model';

const routes: StringIndexable<RouteInfo> = {
  about: {
    path: '/about',
  },
  home: {
    path: '/',
  },
  default: {
    name: 'NOT_FOUND',
    path: '/*',
  },
};

export default routes;
