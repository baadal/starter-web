import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/core/routes/routes';
import { PropsRoot } from 'src/core/models/common.model';
import { HomePageData } from 'src/core/models/response.model';

import common from 'src/assets/css/common.module.scss';

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
            <Link to={routes.about.path}>About Us</Link>
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
