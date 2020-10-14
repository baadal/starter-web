import React from 'react';

import image from 'src/assets/images/logo.png';

class About extends React.Component<any> {
  render() {
    return (
      <>
        <h2>About</h2>
        <p>React starter kit for building high-performance Web Apps.</p>
        <img src={image} alt="logo" height="100" />
      </>
    );
  }
}

export default About;
