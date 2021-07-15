import React from 'react';
import prettyMilliseconds from 'pretty-ms';

import common from 'assets/css/common.module.scss';

const Footer = (props: FooterProps) => {
  const { footerData } = props;
  const link = footerData?.externalLinks?.[0];

  if (!link) return null;

  const buildTime = JSON.parse(process.env.BUILD_TIME || '0') * 1000;
  let elapsed = buildTime > 0 ? prettyMilliseconds(Date.now() - buildTime, { compact: true }) : '';
  if (elapsed) elapsed += ' ago';

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
      <br />
      <span>
        <small>
          Last build: <span className={common.textOlive}>{elapsed}</span>
        </small>
      </span>
    </div>
  );
};

export interface FooterProps {
  footerData: any;
}

export default Footer;
