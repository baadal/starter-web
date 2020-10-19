import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';
import Dotenv from 'dotenv-webpack';

const config: webpack.Configuration = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    index: './src/api.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(process.cwd(), 'build/api'),
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
    new Dotenv({ path: path.resolve(process.cwd(), `env/.env`) }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      PLATFORM: ''
    }),
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
