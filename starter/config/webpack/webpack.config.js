const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');

const dev = require('./webpack.dev');
const { checkProd, checkServer } = require('../../env');

const isProd = checkProd();
const isServer = checkServer();

const common = (env) => {
  const buildRoot = 'build';
  const outFolder = isServer ? `${buildRoot}/server` : `${buildRoot}/public`;

  const outputFileName = '[name].js';
  const chunkFilename = '[name].chunk.js';

  const envConfig = {};

  if (isServer) {
    envConfig.target = 'node'; // Target node environment on server (ignore built-in modules like path, fs, etc.)
    envConfig.externals = [nodeExternals()]; // No need to bundle node_modules folder for backend/server
  }

  const resolve = {};
  if (!isServer) {
    resolve.fallback = { fs: false }; // Don't provide node module polyfills in non-node environment
  }

  const plugins = [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      PLATFORM: '',
    }),
  ];

  if (isServer) {
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }));
  }

  let devtool = null;
  if (!isServer && !isProd) {
    devtool = 'inline-source-map';
  } else {
    // devtool = 'source-map';
  }

  const stats = {
    // timings: false,
    hash: false,
    version: false,
    builtAt: false,
    assets: false,
    entrypoints: false,
    modules: false,
    chunks: true,
    children: false
  };

  const entry = isServer ? {
    index: './src/index.ts'
  } : {
    client: './src/client.ts'
  };

  let config = {
    entry,
    output: {
      filename: outputFileName,
      chunkFilename: chunkFilename,
      path: path.resolve(process.cwd(), outFolder),
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      ...resolve,
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
      ]
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    stats,
    plugins,
    ...envConfig,
  };
  if (devtool) config = { ...config, devtool };

  return config;
};

module.exports = (env = {}) => {
  const commonConfig = common(env);
  const envConfig = dev(env);
  return merge(commonConfig, envConfig);
};
