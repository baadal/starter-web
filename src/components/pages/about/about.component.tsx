import React, { useEffect } from 'react';

import HttpClient from 'src/core/services/http-client';
import env from 'src/const/env.values';

import image from 'src/assets/images/logo.png';

const About = (_props: React.ComponentProps<any>) => {
  useEffect(() => {
    HttpClient.get(`${env.apiBaseUrl}/api/v1/data/about`).subscribe(resp => {
      console.log(resp);
    });
  }, []);

  return (
    <>
      <h2>About</h2>
      <p>React Starter Kit for building Modern Web Apps.</p>
      <img src={image} alt="logo" height="200" />
    </>
  );
};

export default About;
