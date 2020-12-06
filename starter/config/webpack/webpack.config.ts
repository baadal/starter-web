import path from 'path';
import webpack, { Configuration, ResolveOptions, Entry, WebpackPluginInstance } from 'webpack';
import merge from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import dotenv from 'dotenv';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// @ts-ignore
import nodeExternals from 'webpack-node-externals';
// @ts-ignore
import IgnoreEmitPlugin from 'ignore-emit-webpack-plugin';
// @ts-ignore
import LoadablePlugin from '@loadable/webpack-plugin';

import dev from './webpack.dev';
import prod from './webpack.prod';
import { checkProd, checkServer } from '../../env';

const isProd = checkProd();
const isServer = checkServer();

const dotEnvFile = `custom/env/.env.${isProd ? 'prod' : 'dev'}`;
dotenv.config({ path: path.resolve(process.cwd(), dotEnvFile) });

const common = (env: any) => {
  const buildRoot = 'build';
  const outFolder = isServer ? `${buildRoot}/server` : `${buildRoot}/public`;

  const statsFileName = 'loadable-stats.json';

  const outputFileName = (!isServer && isProd) ? '[name].[contenthash:10].js' : '[name].js';
  const chunkFilename = (!isServer && isProd) ? '[name].[contenthash:10].chunk.js' : '[name].chunk.js';

  const miniCssFileName = isProd ? 'style.[contenthash:10].css' : 'style.css';
  const miniCssChunkName = isProd ? '[name].[contenthash:10].chunk.css' : '[name].chunk.css';

  const assetName = isProd ? '[name].[contenthash:10][ext]' : '[name][ext]';

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
    new Dotenv({ path: path.resolve(process.cwd(), `custom/env/.env`) }),
    new webpack.EnvironmentPlugin({
      npm_package_version: '',
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      PLATFORM: '',
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
    plugins.push(new CopyWebpackPlugin({
      patterns: [
        { from: 'custom/static' }
      ]
    }));
    plugins.push(new LoadablePlugin({
      filename: statsFileName,
      outputAsset: false,
      writeToDisk: {
        filename: path.resolve(process.cwd(), buildRoot),
      }
    }) as any); // [TO FIX]: LoadablePlugin != WebpackPluginInstance
  }

  if (isServer && isProd) {
    plugins.push(new IgnoreEmitPlugin(/\.css$/));
  }

  let devtool: Configuration['devtool'] | null = null;
  if (!isServer && !isProd) {
    devtool = 'inline-source-map';
  } else {
    // devtool = 'source-map';
  }

  const assetsBaseUrl = process.env.ASSETS_BASE_URL || '';
  const publicPath = `${assetsBaseUrl}/`;

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
    ]
  };

  let config: Configuration = {
    entry,
    output: {
      filename: outputFileName,
      chunkFilename: chunkFilename,
      path: path.resolve(process.cwd(), outFolder),
      publicPath,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        src: path.resolve(process.cwd(), 'src/'),
        starter: path.resolve(process.cwd(), 'starter/'),
      },
      ...resolve,
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          use: 'babel-loader',
          exclude: {
            and: [
              // exclude libraries in node_modules
              /node_modules/,
            ],
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
          type: 'asset/resource',
          generator: {
            filename: `images/${assetName}`,
            emit: !isServer,
          },
        },
        {
          test: /\.(ttf|woff2?)$/i,
          type: 'asset/resource',
          generator: {
            filename: `fonts/${assetName}`,
            emit: !isServer,
          },
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
  const envConfig = (isProd ? prod : dev)(env);
  return merge(commonConfig, envConfig);
};

export default config;
