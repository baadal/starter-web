import React from 'react';
import { matchPath } from 'react-router-dom';
import baseLoadable from '@loadable/component';
import { FallbackComponent } from 'src/utils/view';

import { Route, RouteData } from 'src/core/models/route.model';
import routes from './routes';

const loadable = (func: any) => baseLoadable(func, { fallback: <FallbackComponent /> });

export const routesData: RouteData[] = [
  {
    path: routes.about.path,
    component: loadable(
      () => import(/* webpackChunkName: "about", webpackPrefetch: true */ 'src/components/pages/about/about.component')
    ),
    source: routes.about.source,
  },
  {
    path: routes.cssStylesDemo.path,
    component: loadable(
      () => import(/* webpackChunkName: "demo", webpackPrefetch: true */ 'src/components/pages/demo/css-styles/css-styles.component') // eslint-disable-line
    ),
    source: routes.cssStylesDemo.source,
  },
  {
    path: routes.cssInJsDemo.path,
    component: loadable(
      () => import(/* webpackChunkName: "demo", webpackPrefetch: true */ 'src/components/pages/demo/css-in-js/css-in-js.component') // eslint-disable-line
    ),
    source: routes.cssInJsDemo.source,
  },
  {
    path: routes.home.path,
    component: loadable(
      () => import(/* webpackChunkName: "home", webpackPrefetch: true */ 'src/components/pages/home/home.component')
    ),
    source: routes.home.source,
  },
  {
    name: routes.default.name,
    path: routes.default.path,
    component: require('src/components/pages/not-found/not-found.component').default,
    source: routes.default.source,
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
