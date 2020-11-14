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

import dev from './webpack.dev';
import { checkProd, checkServer } from '../../utils/env';

const isProd = checkProd();
const isServer = checkServer();

const dotEnvFile = `custom/env/.env.${isProd ? 'prod' : 'dev'}`;
dotenv.config({ path: path.resolve(process.cwd(), dotEnvFile) });

const common = (env: any) => {
  const buildRoot = 'build';
  const outFolder = isServer ? `${buildRoot}/server` : `${buildRoot}/public`;

  const outputFileName = '[name].js';
  const chunkFilename = '[name].chunk.js';

  const miniCssFileName = 'style.css';
  const miniCssChunkName = '[name].chunk.css';

  const assetName = '[name][ext]';

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
        { from: 'web/assets/static' }
      ]
    }));
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
    index: './web/index.ts'
  } : {
    client: './web/client.tsx'
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
        app: path.resolve(process.cwd(), 'web/'),
        web: path.resolve(process.cwd(), 'web/'),
        pages: path.resolve(process.cwd(), 'web/pages/'),
        routes: path.resolve(process.cwd(), 'web/routes/'),
        components: path.resolve(process.cwd(), 'web/components/'),
        model: path.resolve(process.cwd(), 'web/model/'),
        assets: path.resolve(process.cwd(), 'web/assets/'),
        starter: path.resolve(process.cwd(), 'starter/'),
      },
      ...resolve,
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          use: [...getStyleLoaders()],
          exclude: /\.module\.s?css$/,
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
