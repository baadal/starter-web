import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = (_props: React.ComponentProps<any>) => {
  return (
    <>
      <h2>Page Not Found (404)</h2>
      <p>This page does not exist.</p>
      <Link to="/">
        <small>Return to Homepage</small>
      </Link>
    </>
  );
};

export default NotFound;
