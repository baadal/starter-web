import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from 'src/components/partials/header/header.component';
import Footer from 'src/components/partials/footer/footer.component';
import { routesProvider } from 'src/core/routes/routes.provider';

import 'src/assets/css/global.css';

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
