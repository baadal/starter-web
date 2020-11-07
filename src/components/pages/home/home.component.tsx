import React from 'react';
import { Link } from 'react-router-dom';

import { PropsRoot } from 'src/core/models/common.model';

import 'src/assets/css/common.css';

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <>
        <h2 className="hero-text">My Web App</h2>
        <p>The modern way!</p>
        <ul>
          <li>
            <Link to="/demo/broken-link">Demo: Broken Link</Link>
          </li>
        </ul>
      </>
    );
  }
}

export default Home;

export interface HomeProps extends PropsRoot {}

export interface HomeState {}
