import React from 'react';

import { AboutPageData } from 'model/pagedata.model';

import common from 'assets/css/common.module.scss';
import image from 'assets/images/logo.png';

class About extends React.Component<AboutProps, AboutState> {
  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';
    const description = pageData?.description || '';

    return (
      <>
        <h2 className={common.pageTitle}>{title}</h2>
        <p>{description}</p>
        <img src={image} alt="logo" height="100" />
      </>
    );
  }
}

export interface AboutProps {
  pageData: AboutPageData | null;
}

export interface AboutState {}

export default About;
