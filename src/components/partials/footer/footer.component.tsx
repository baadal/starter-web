import React from 'react';

import common from 'src/assets/css/common.module.scss';

const Footer = (props: FooterProps) => {
  const { footerData } = props;
  const link = footerData?.externalLinks?.[0];

  if (!link) return null;

  return (
    <div className={common.footer}>
      <br />
      <span>
        <span>Built with</span>{' '}
        <a href={link.path} target="_blank" rel="noreferrer">
          {link.title}
        </a>{' '}
        <small>
          (<code>v{process.env.npm_package_version}</code>)
        </small>
      </span>
    </div>
  );
};

export interface FooterProps {
  footerData: any;
}

export default Footer;
