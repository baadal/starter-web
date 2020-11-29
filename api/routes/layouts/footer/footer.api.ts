import express from 'express';

export const footerInfo = (req: express.Request) => {
  const resp = {
    links: [] as any[],
    externalLinks: [] as any[],
  };

  if (req.query.path === '/about') {
    resp.externalLinks.push({
      path: 'https://starterjs.dev/',
      title: 'Starter.js',
    });
  }

  return resp;
};
