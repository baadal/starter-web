import React from 'react';

import { CssStylesDemoData } from 'src/core/models/response.model';

import styles from './css-styles.module.scss';

class CssStylesDemo extends React.Component<CssStylesDemoProps, CssStylesDemoState> {
  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';

    return (
      <>
        <h2>{title}</h2>
        <div className={styles.demo}>
          <div className={styles.gradientDemo}>linear-gradient (Vendor prefixes)</div>
          <br />
          <div className={styles.modernFont}>font-family: system-ui (Modern font)</div>
          <br />
          <div>
            <a href="//g.co">Hover Me!</a>
          </div>
        </div>
      </>
    );
  }
}

export interface CssStylesDemoProps {
  pageData: CssStylesDemoData | null;
}

export interface CssStylesDemoState {}

export default CssStylesDemo;
