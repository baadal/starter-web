import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/core/routes/routes';
import { PropsRoot } from 'src/core/models/common.model';

import 'src/assets/css/common.css';

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <>
        <div className="text-center">
          <div className="hero-text">
            <span>Starter.js</span>
            <span className="hero-split">&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>
            <span className="hero-subtext">React Starter Kit</span>
          </div>
          <p>Start Building!</p>
        </div>
        <div className="page-desc">
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
            <span className="emoji-big">🚀</span>
          </p>
        </div>
      </>
    );
  }
}

export default Home;

export interface HomeProps extends PropsRoot {}

export interface HomeState {}
