import path from 'path';
import webpack, { Configuration, ResolveOptions, Entry, WebpackPluginInstance } from 'webpack';
import merge from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// @ts-ignore
import nodeExternals from 'webpack-node-externals';

import dev from './webpack.dev';
import { checkProd, checkServer } from '../src/utils/env.utils';

const isProd = checkProd();
const isServer = checkServer();

const common = (env: any) => {
  const buildRoot = 'build';
  const outFolder = isServer ? `${buildRoot}/server` : `${buildRoot}/public`;

  const outputFileName = '[name].js';
  const chunkFilename = '[name].chunk.js';

  const envConfig: Configuration = {};

  if (isServer) {
    envConfig.externalsPresets = { node: true }; // Target node environment on server (ignore built-in modules like path, fs, etc.)
    envConfig.externals = [nodeExternals()]; // No need to bundle modules in node_modules folder for backend/server
  }

  const resolve: ResolveOptions = {};
  if (!isServer) {
    resolve.fallback = { fs: false }; // Don't provide node module polyfills in non-node environment
  }

  const plugins: WebpackPluginInstance[] = [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      PLATFORM: '',
    }),
  ];

  if (isServer) {
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }));
  } else {
    plugins.push(new CopyWebpackPlugin({
      patterns: [
        { from: 'static' }
      ]
    }));
  }

  let devtool: Configuration['devtool'] | null = null;
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

  const entry: Entry = isServer ? {
    index: './src/index.ts'
  } : {
    client: './src/client.ts'
  };

  let config: Configuration = {
    entry,
    output: {
      filename: outputFileName,
      chunkFilename: chunkFilename,
      path: path.resolve(process.cwd(), outFolder),
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        src: path.resolve(process.cwd(), 'src/'),
      },
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

const config = (env: any = {}) => {
  const commonConfig = common(env);
  const envConfig = dev(env);
  return merge(commonConfig, envConfig);
};

export default config;
