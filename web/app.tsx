import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { UnregisterCallback } from 'history'; // eslint-disable-line

import { routesProvider } from 'starter/core/routes/routes.provider';
import withInitialData from 'starter/hocs/with-initial-data';
import logger from 'starter/utils/logger';
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

  componentDidUpdate(prevProps: AppProps) {
    if (this.props.pageData && this.props.pageData !== prevProps.pageData) {
      const { title, description } = this.props.pageData.seo || {};
      if (title) {
        document.title = title;
      } else {
        logger.warn('SEO: page title missing!');
      }
      if (description) {
        document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      } else {
        logger.warn('SEO: meta description missing!');
      }
    }
  }

  componentWillUnmount() {
    if (this.unregisterCallback) this.unregisterCallback();
  }

  render() {
    const { pageData, headerData, footerData } = this.props;
    const routes = routesProvider();

    return (
      <>
        <Header headerData={headerData} />
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
        <Footer footerData={footerData} />
      </>
    );
  }
}

export interface AppProps extends PropsRoot {
  pageData: any;
  headerData: any;
  footerData: any;
  resetInitialData: Function;
}

export interface AppState {}

export default withRouter(withInitialData(App));
