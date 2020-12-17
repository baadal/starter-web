import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'routes/routes';
import { PropsRoot } from 'model/common.model';
import { HomePageData } from 'model/pagedata.model';

import common from 'assets/css/common.module.scss';

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';
    const description = pageData?.description || '';

    return (
      <>
        <div className={common.textCenter}>
          <div className={common.heroText}>{title}</div>
        </div>
        <p className={common.punchline}>{description}</p>
        <ul>
          <li>
            <Link to={routes.cssStylesDemo.path}>Demo: CSS Styles</Link>
          </li>
          <li>
            <Link to={routes.cssInJsDemo.path}>Demo: CSS-in-JS (emotion)</Link>
          </li>
          <li>
            <Link to={routes.stateStoreDemo.path}>Demo: State Store</Link>
          </li>
          <li>
            <Link to="/demo/fibonacci/10">Demo: Parameterized Routing</Link>
          </li>
          <li>
            <Link to={routes.esnextDemo.path}>Demo: ES6+ Features &amp; Web APIs</Link>
          </li>
          <li>
            <Link to="/demo/broken-link">Demo: Broken Link</Link>
          </li>
        </ul>
        <p className={common.punchline}>Performance</p>
        <ul>
          <li>
            <a href="https://web.dev/measure/" target="_blank" rel="noreferrer">
              Lighthouse
            </a>
          </li>
          <li>
            <a href="https://gtmetrix.com/" target="_blank" rel="noreferrer">
              GTmetrix
            </a>
          </li>
        </ul>
      </>
    );
  }
}

export default Home;

export interface HomeProps extends PropsRoot {
  pageData: HomePageData | null;
}

export interface HomeState {}
