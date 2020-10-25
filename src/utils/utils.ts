import { Location } from 'history'; // eslint-disable-line
import { matchPath } from 'react-router-dom';

import { findRouteData } from 'src/core/routes/routes.provider';
import { GenericRequest } from 'src/core/models/common.model';
import { parseQueryString } from 'src/utils/lib.utils';

export const getGenericReqFromLocation = (location: Location): GenericRequest | null => {
  const routeData = findRouteData(location.pathname);
  if (!routeData) return null;

  const path = location.pathname;
  const url = path + location.search;
  const query = parseQueryString(location.search);
  const route = { path: routeData.path };

  const match = matchPath(path, routeData.path) || { params: {} };
  const params = { ...match.params };

  return { url, path, route, query, params };
};
