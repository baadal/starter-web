import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/core/routes/routes';
import withInitialData from 'src/hocs/with-initial-data';
import { PropsRoot } from 'src/core/models/common.model';
import { HomePageData } from 'src/core/models/response.model';

import styles from 'src/assets/css/common.module.scss';

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';
    const description = pageData?.description || '';

    return (
      <>
        <h2 className={styles.heroText}>{title}</h2>
        <p>{description}</p>
        <ul>
          <li>
            <Link to={routes.cssStylesDemo.path}>Demo: CSS Styles</Link>
          </li>
          <li>
            <Link to={routes.cssInJsDemo.path}>Demo: CSS-in-JS (emotion)</Link>
          </li>
          <li>
            <Link to="/demo/broken-link">Demo: Broken Link</Link>
          </li>
        </ul>
      </>
    );
  }
}

export default withInitialData(Home);

export interface HomeProps extends PropsRoot {
  pageData: HomePageData | null;
}

export interface HomeState {}
