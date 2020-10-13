import { routesData } from 'routes/routes-data';
import { Route, RouteData } from '../model/route.model';

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
