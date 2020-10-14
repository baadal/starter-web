import path from 'path';
import webpack, { Configuration, ConfigurationFactory, Entry, Plugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import merge from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import dotenv from 'dotenv';

import dev from './webpack.dev';
import { checkProd, checkServer } from '../src/utils/env.utils';

const isProd = checkProd();
const isServer = checkServer();

const dotEnvFile = `env/.env.${isProd ? 'prod' : 'dev'}`;
dotenv.config({ path: path.resolve(process.cwd(), dotEnvFile) });

const common: ConfigurationFactory = (env: any) => {
  const buildRoot = 'build';
  const outFolder = isServer ? `${buildRoot}/server` : `${buildRoot}/public`;

  const outputFileName = '[name].js';
  const chunkFilename = '[name].chunk.js';

  const assetName = '[name].[ext]';

  const envConfig: Configuration = {};

  if (isServer) {
    envConfig.target = 'node'; // Target node environment on server (ignore built-in modules like path, fs, etc.)
    envConfig.externals = [nodeExternals()]; // No need to bundle node_modules folder for backend/server
  } else {
    envConfig.node = { fs: 'empty' }; // Don't provide node module polyfills in non-node environment
  }

  const plugins: Plugin[] = [
    new Dotenv({ path: path.resolve(process.cwd(), `env/.env`) }),
    new webpack.EnvironmentPlugin({
      npm_package_version: '',
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

  let devtool: Configuration['devtool'] = false;
  if (!isServer && !isProd) {
    devtool = 'inline-source-map';
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
    client: './src/client.tsx'
  };

  return ({
    entry,
    output: {
      filename: outputFileName,
      chunkFilename: chunkFilename,
      path: path.resolve(process.cwd(), outFolder),
      publicPath: (process.env.ASSETS_BASE_URL || '') + '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        src: path.resolve(process.cwd(), 'src/'),
        starter: path.resolve(process.cwd(), 'starter/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `images/${assetName}`,
                emitFile: !isServer,
              },
            },
          ],
        },
      ]
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    devtool,
    stats,
    plugins,
    ...envConfig,
  });
};

const config: ConfigurationFactory = (env: any = {}) => {
  const commonConfig = common(env, {}) as Configuration;
  const envConfig = dev(env, {}) as Configuration;
  return merge(commonConfig, envConfig);
};

export default config;
