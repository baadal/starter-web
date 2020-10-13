import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { routesProvider } from 'starter/core/routes/routes.provider';
import Header from 'components/layouts/header/header.component';
import Footer from 'components/layouts/footer/footer.component';

class App extends React.Component<any> {
  render() {
    const routes = routesProvider();

    return (
      <>
        <Header />
        <Switch>
          {routes.map(route => (
            <Route
              path={route.path}
              exact={route.exact}
              render={(props: any) => <route.component {...props} />}
              key={route.path}
            />
          ))}
        </Switch>
        <Footer />
      </>
    );
  }
}

export default App;
