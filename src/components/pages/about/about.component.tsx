import React from 'react';

import { AboutPageData } from 'src/core/models/response.model';

import image from 'src/assets/images/logo.png';

const About = (props: AboutProps) => {
  const { pageData } = props;
  const title = pageData?.title || '';
  const description = pageData?.description || '';

  return (
    <>
      <h2>{title}</h2>
      <p>{description}</p>
      <img src={image} alt="logo" height="200" />
    </>
  );
};

export interface AboutProps {
  pageData: AboutPageData | null;
}

export default About;
