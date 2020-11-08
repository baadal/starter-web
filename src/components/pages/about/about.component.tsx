import React from 'react';

import common from 'src/assets/css/common.module.css';
import image from 'src/assets/images/logo.png';

class About extends React.Component<any> {
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
