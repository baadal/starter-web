import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'routes/routes';
import { PropsRoot } from 'model/common.model';

import common from 'assets/css/common.module.scss';

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <>
        <div className={common.textCenter}>
          <div className={common.heroText}>
            <span>Starter.js</span>
            <span className={common.heroSplit}>&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>
            <span className={common.heroSubtext}>React Starter Kit</span>
          </div>
          <p>Start Building!</p>
        </div>
        <div className={common.pageDesc}>
          <p>
            Please visit{' '}
            <a href="https://starterjs.dev/docs" target="_blank" rel="noreferrer">
              starterjs.dev
            </a>{' '}
            for documentation and tutorials. You can explore the project on{' '}
            <a href="https://github.com/baadal/starter-app" target="_blank" rel="noreferrer">
              GitHub
            </a>{' '}
            and learn more <Link to={routes.about.path}>about</Link> it.
          </p>
          <p>
            <em>Build something awesome!</em>
            <span>&nbsp;&nbsp;</span>
            <span className={common.emojiBig}>🚀</span>
          </p>
        </div>
      </>
    );
  }
}

export default Home;

export interface HomeProps extends PropsRoot {}

export interface HomeState {}
