import path from 'path';
import webpack, { Configuration, ConfigurationFactory, Entry, Plugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import merge from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import dotenv from 'dotenv';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// @ts-ignore
import IgnoreEmitPlugin from 'ignore-emit-webpack-plugin';
// @ts-ignore
import EventHooksPlugin from 'event-hooks-webpack-plugin';

import dev from './webpack.dev';
import prod from './webpack.prod';
import { checkProd, checkServer, checkModern } from '../src/utils/env.utils';
import * as event from '../starter/event';

const isProd = checkProd();
const isServer = checkServer();
const isModern = checkModern();
const isAnalyze = (process.env.BUNDLE_ANALYZE === 'true');

const dotEnvFile = `env/.env.${isProd ? 'prod' : 'dev'}`;
dotenv.config({ path: path.resolve(process.cwd(), dotEnvFile) });

const common: ConfigurationFactory = (env: any) => {
  const buildRoot = 'build';
  const outFolder = isServer ? `${buildRoot}/server` : `${buildRoot}/public`;

  const extJs = isModern ? 'esm.js' : 'js';
  const dirJs = isModern ? 'js/esm/' : (!isServer ? 'js/' : '');
  const statsFileName = isModern ? 'loadable-stats.esm.json' : 'loadable-stats.json';

  const outputFileName = (!isServer && isProd) ? `[name].[contenthash:10].${extJs}` : `[name].${extJs}`;
  const chunkFilename = (!isServer && isProd) ? `[name].[contenthash:10].chunk.${extJs}` : `[name].chunk.${extJs}`;

  const miniCssFileName = isProd ? 'style.[contenthash:10].css' : 'style.css';
  const miniCssChunkName = isProd ? '[name].[contenthash:10].chunk.css' : '[name].chunk.css';

  const assetName = isProd ? '[name].[contenthash:10].[ext]' : '[name].[ext]';

  const envConfig: Configuration = {};

  if (isServer) {
    envConfig.target = 'node'; // Target node environment on server (ignore built-in modules like path, fs, etc.)
    envConfig.externals = [nodeExternals()]; // No need to bundle node_modules folder for backend/server
  } else {
    envConfig.node = { fs: 'empty' }; // Don't provide node module polyfills in non-node environment
  }

  const plugins: Plugin[] = [
    new EventHooksPlugin({
      run: () => event.run(),
      watchRun: () => event.watchRun(),
      make: () => event.make(isServer),
      assetEmitted: (f: string, c: any) => event.assetEmitted(f, c),
      done: () => event.done(isServer),
    }),
    new Dotenv({ path: path.resolve(process.cwd(), `env/.env`) }),
    new webpack.EnvironmentPlugin({
      npm_package_version: '',
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      PLATFORM: '',
      MODERN: '',
    }),
    new MiniCssExtractPlugin({
      filename: `css/${miniCssFileName}`,
      chunkFilename: `css/${miniCssChunkName}`,
    }),
  ];

  if (isServer) {
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }));
  } else {
    plugins.push(new LoadablePlugin({
      filename: statsFileName,
      outputAsset: false,
      writeToDisk: {
        filename: path.resolve(process.cwd(), buildRoot),
      }
    }));
  }

  if (!isServer && !isModern) {
    plugins.push(new CopyWebpackPlugin({
      patterns: [
        { from: 'static' }
      ]
    }));
  }

  if (isServer && isProd) {
    plugins.push(new IgnoreEmitPlugin(/\.css$/));
  }

  if (isAnalyze) {
    plugins.push(new BundleAnalyzerPlugin());
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
    chunks: !true,
    children: false
  };

  const cssLoader = (nextCount: number, modules?: boolean) => {
    if (!modules) {
      return 'css-loader';
    }
    return ({
      loader: 'css-loader',
      options: {
        importLoaders: nextCount,
        // esModule: true,
        modules: {
          // namedExport: true,
          exportLocalsConvention: 'camelCaseOnly',
          localIdentName: isProd ? '[local]_[hash:base64:5]' : '[name]__[local]__[hash:base64:5]',
        },
      }
    });
  };

  const styleLoader = (modules?: boolean) => {
    if (!modules) {
      return 'style-loader';
    }
    return ({
      loader: 'style-loader',
    });
  };

  const cssExtractLoader = (modules?: boolean) => {
    if (!modules) {
      return MiniCssExtractPlugin.loader;
    }
    return ({
      loader: MiniCssExtractPlugin.loader,
    });
  };

  const postcssLoader = () => {
    return ({
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: path.resolve(process.cwd(), 'postcss.config.js'),
        },
      },
    });
  };

  const getStyleLoaders = (modules?: boolean) => {
    const nextLoaders = [postcssLoader(), 'sass-loader'];
    const loaders: any[] = [cssLoader(nextLoaders.length, modules), ...nextLoaders];
    if (!isServer) {
      if (!isProd) {
        loaders.unshift(styleLoader(modules));
      } else {
        loaders.unshift(cssExtractLoader(modules));
      }
    } else {
      loaders.unshift(cssExtractLoader(modules));
    }
    return loaders;
  };

  const entry: Entry = isServer ? {
    index: './src/index.ts'
  } : {
    client: [
      'whatwg-fetch',
      'intersection-observer',
      './src/client.tsx'
    ],
    scriptTop: './starter/script-top.ts',
    scriptBottom: './starter/script-bottom.ts'
  };

  return ({
    entry,
    output: {
      filename: `${dirJs}${outputFileName}`,
      chunkFilename: `${dirJs}${chunkFilename}`,
      path: path.resolve(process.cwd(), outFolder),
      publicPath: (process.env.ASSETS_BASE_URL || '') + '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        src: path.resolve(process.cwd(), 'src/'),
        starter: path.resolve(process.cwd(), 'starter/'),
        sticky_modules: path.resolve(process.cwd(), 'sticky_modules/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          use: 'babel-loader',
          exclude: {
            test: /node_modules/, // exclude libraries in node_modules
            not: [
              // however, transpile these libraries because they use modern syntax
              /node_modules\/@loadable\/component/,
            ],
          },
        },
        {
          test: /\.s?css$/,
          use: [...getStyleLoaders()],
          exclude: /\.module\.s?css$/,
          sideEffects: true,
        },
        {
          test: /\.module\.s?css$/,
          use: [...getStyleLoaders(true)],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `images/${assetName}`,
                emitFile: !isServer && !isModern,
              },
            },
          ],
        },
        {
          test: /\.(ttf|woff2?)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `fonts/${assetName}`,
                emitFile: !isServer && !isModern,
              }
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
  const envConfig = (isProd ? prod : dev)(env, {}) as Configuration;
  return merge(commonConfig, envConfig);
};

export default config;
