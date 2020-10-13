import { RouteData } from 'starter/core/model/route.model';
import routes from './routes';

export const routesData: RouteData[] = [
  {
    path: routes.about.path,
    component: require('pages/about/about.component').default,
  },
  {
    path: routes.home.path,
    component: require('pages/home/home.component').default,
  },
  {
    name: routes.default.name,
    path: routes.default.path,
    component: require('pages/not-found/not-found.component').default,
  },
];
