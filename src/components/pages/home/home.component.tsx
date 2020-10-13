import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/core/routes/routes';
import { PropsRoot } from 'src/core/models/common.model';

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <>
        <div>
          <h2>Starter.js &bull; React Starter Kit</h2>
          <p>Start Building!</p>
        </div>
        <div>
          <p>
            Please visit{' '}
            <a href="https://starterjs.dev/docs" target="_blank" rel="noreferrer">
              starterjs.dev
            </a>{' '}
            for documentation and tutorials. Explore the project on{' '}
            <a href="https://github.com/baadal/starter-web" target="_blank" rel="noreferrer">
              GitHub
            </a>{' '}
            and learn more <Link to={routes.about.path}>about</Link> it.
          </p>
          <p>
            <em>Build something awesome!</em>
            <span>&nbsp;&nbsp;</span>
            <span>🚀</span>
          </p>
        </div>
      </>
    );
  }
}

export default Home;

export interface HomeProps extends PropsRoot {}

export interface HomeState {}
