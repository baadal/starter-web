import { Express } from 'express';

// import routes from 'src/core/routes/routes';
import { routesData } from 'src/core/routes/routes.provider';
import { routeHandler } from 'src/core/routes/routes.handler';

const allRoutes = (app: Express) => {
  // app.get(routes.about.path, routeHandler);
  // app.get(routes.home.path, routeHandler);
  // app.get(routes.default.path, routeHandler);

  routesData.forEach(data => app.get(data.path, routeHandler));
  // routesData.forEach(data => app.get(data.path, routeHandler(data)));
};

export default allRoutes;
