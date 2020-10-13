import { StringIndexable } from 'src/core/models/common.model';
import { RouteInfo } from 'src/core/models/route.model';

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
