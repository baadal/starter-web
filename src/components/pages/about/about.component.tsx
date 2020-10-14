import React from 'react';

import image from 'src/assets/images/logo.png';

const About = (_props: React.ComponentProps<any>) => {
  return (
    <>
      <h2>About</h2>
      <p>React Starter Kit for building Modern Web Apps.</p>
      <img src={image} alt="logo" height="200" />
    </>
  );
};

export default About;
