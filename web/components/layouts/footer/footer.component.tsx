import React from 'react';

import 'assets/css/common.css';

const Footer = (_props: React.ComponentProps<any>) => {
  return (
    <div className="footer">
      <br />
      <span>
        <span>Built with</span>{' '}
        <a href="https://starterjs.dev/" target="_blank" rel="noreferrer">
          Starter.js
        </a>{' '}
        <small>
          (<code>v{process.env.npm_package_version}</code>)
        </small>
      </span>
    </div>
  );
};

export default Footer;
