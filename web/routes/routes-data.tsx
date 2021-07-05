import React from 'react';
import baseLoadable from '@loadable/component';

import { RouteData } from 'starter/core/model/route.model';
import routes from './routes';

const FallbackComponent = () => <div>Loading...</div>;

const loadable = (func: any) => baseLoadable(func, { fallback: <FallbackComponent /> });

export const routesData: RouteData[] = [
  {
    path: routes.about.path,
    component: loadable(() => import(/* webpackChunkName: "about" */ 'pages/about/about.component')),
    source: routes.about.source,
  },
  {
    path: routes.home.path,
    component: loadable(() => import(/* webpackChunkName: "home" */ 'pages/home/home.component')),
    source: routes.home.source,
  },
  {
    name: routes.default.name,
    path: routes.default.path,
    component: require('pages/not-found/not-found.component').default,
    source: routes.default.source,
  },
];
