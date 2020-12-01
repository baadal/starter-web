import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { UnregisterCallback } from 'history'; // eslint-disable-line

import { routesProvider } from 'starter/core/routes/routes.provider';
import withInitialData from 'starter/hocs/with-initial-data';
import Header from 'components/layouts/header/header.component';
import Footer from 'components/layouts/footer/footer.component';
import { PropsRoot } from 'model/common.model';

import 'assets/css/global.scss';

class App extends React.Component<AppProps, AppState> {
  private unregisterCallback: UnregisterCallback | null = null;

  componentDidMount() {
    this.unregisterCallback = this.props.history.listen(location => {
      if (location.pathname !== this.props.location.pathname) {
        if ((window as any).__initialData__) {
          delete (window as any).__initialData__;
        }
        this.props.resetInitialData();
      }
    });
  }

  componentWillUnmount() {
    if (this.unregisterCallback) this.unregisterCallback();
  }

  render() {
    const { pageData } = this.props;
    const routes = routesProvider();

    return (
      <>
        <Header />
        <Switch>
          {routes.map(route => (
            <Route
              path={route.path}
              exact={route.exact}
              render={(props: any) => <route.component {...props} pageData={pageData} />}
              key={route.path}
            />
          ))}
        </Switch>
        <Footer />
      </>
    );
  }
}

export interface AppProps extends PropsRoot {
  pageData: any;
  resetInitialData: Function;
}

export interface AppState {}

export default withRouter(withInitialData(App));
