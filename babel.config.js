// const envUtils = require('./src/utils/env.utils');

// const isProd = envUtils.checkProd();
// const isServer = envUtils.checkServer();

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: { version: 3, proposals: true },
        shippedProposals: true,
        // debug: !isProd && !isServer,
      }
    ],
    "@babel/preset-typescript"
  ],
  plugins: [
    // "@babel/plugin-transform-runtime", // https://github.com/babel/babel/issues/6629#issuecomment-416986687
    // "@babel/plugin-proposal-class-properties", // https://babeljs.io/docs/en/babel-preset-env#shippedproposals
    // "@babel/plugin-proposal-object-rest-spread",
    // "@babel/plugin-proposal-optional-chaining",
    // "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
};