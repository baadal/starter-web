import { matchPath } from 'react-router-dom';

import { routesData } from 'app/routes/routes-data';
import { Route, RouteData } from '../model/route.model';

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
