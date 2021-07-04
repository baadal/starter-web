import React from 'react';

import { AboutPageData } from 'src/core/models/response.model';

import common from 'src/assets/css/common.module.scss';
import image from 'src/assets/images/logo.png';

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
