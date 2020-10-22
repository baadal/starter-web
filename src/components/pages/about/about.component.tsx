import React from 'react';

import HttpClient from 'src/core/services/http-client';
import env from 'src/const/env.values';

import common from 'src/assets/css/common.module.scss';
import image from 'src/assets/images/logo.png';

class About extends React.Component<any> {
  componentDidMount() {
    HttpClient.get(`${env.apiBaseUrl}/v1/data/about`).subscribe(resp => {
      console.log(resp);
    });
  }

  render() {
    return (
      <>
        <h2 className={common.pageTitle}>About</h2>
        <p>React starter kit for building high-performance Web Apps.</p>
        <img src={image} alt="logo" height="100" />
      </>
    );
  }
}

export default About;
