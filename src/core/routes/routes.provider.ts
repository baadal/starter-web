import { matchPath } from 'react-router-dom';

import { Route, RouteData } from 'src/core/models/route.model';
import routes from './routes';

export const routesData: RouteData[] = [
  {
    path: routes.about.path,
    component: require('src/components/pages/about/about.component').default,
  },
  {
    path: routes.cssStylesDemo.path,
    component: require('src/components/pages/demo/css-styles/css-styles.component').default,
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

export const findRouteData = (pathname: string) => {
  const routeData = routesData.find(data => {
    const match = matchPath(pathname, data.path);
    return !!match?.isExact;
  });
  return routeData;
};

export const findRoute = (pathname: string) => {
  const routeData = findRouteData(pathname);
  if (routeData) {
    return getRoute(routeData);
  }
  return null;
};

export const routesProvider = () => {
  return routesData.map(data => getRoute(data));
};
