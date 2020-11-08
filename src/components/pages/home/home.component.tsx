import React from 'react';
import { Link } from 'react-router-dom';

import { PropsRoot } from 'src/core/models/common.model';

import styles from 'src/assets/css/common.module.css';

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <>
        <h2 className={styles.heroText}>My Web App</h2>
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
