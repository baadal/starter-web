import path from 'path';
import webpack, { Configuration, WebpackPluginInstance } from 'webpack';
import NodemonPlugin from 'nodemon-webpack-plugin';
import Dotenv from 'dotenv-webpack';

// @ts-ignore
import nodeExternals from 'webpack-node-externals';

import { existsFile } from '../../lib/file-io';

const plugins: WebpackPluginInstance[] = [];

const deployEnvFile = path.resolve(process.cwd(), `custom/env/.env.deploy.tmp`);
if (existsFile(deployEnvFile, true)) {
  plugins.push(new Dotenv({ path: deployEnvFile }));
}

const config: Configuration = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    index: './api/api.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(process.cwd(), 'build/api'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      starter: path.resolve(process.cwd(), 'starter/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
    ]
  },
  plugins: [
    new NodemonPlugin({
      delay: 300,
      quiet: true,
    }),
    new Dotenv({ path: path.resolve(process.cwd(), `custom/env/.env`) }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      PLATFORM: ''
    }),
    ...plugins,
  ],
  watchOptions: {
    ignored: /node_modules/
  },
  target: 'node',
  externals: [nodeExternals()],
  stats: {
    timings: false,
    hash: false,
    version: false,
    builtAt: false,
    assets: false,
    entrypoints: false,
    modules: false,
    chunks: false,
    children: false
  },
};

export default config;
