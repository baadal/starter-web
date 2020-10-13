import { Route, RouteData } from 'src/core/models/route.model';
import routes from './routes';

export const routesData: RouteData[] = [
  {
    path: routes.about.path,
    component: require('src/components/pages/about/about.component').default,
  },
  {
    path: routes.home.path,
    component: require('src/components/pages/home/home.component').default,
  },
  {
    name: routes.default.name,
    path: routes.default.path,
    component: require('src/components/pages/not-found/not-found.component').default,
  },
];

export const getRoute = (routeData: RouteData): Route => ({
  name: routeData.name || '',
  path: routeData.path,
  exact: true,
  component: routeData.component,
  source: routeData.source || '',
});

export const routesProvider = () => {
  return routesData.map(data => getRoute(data));
};
