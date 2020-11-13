import React from 'react';

import styles from 'src/assets/css/common.module.scss';

const Footer = (_props: React.ComponentProps<any>) => {
  return (
    <div className={styles.footer}>
      <br />
      <span>© 2020-present</span>
      <span>
        <span>, Built with</span>{' '}
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
