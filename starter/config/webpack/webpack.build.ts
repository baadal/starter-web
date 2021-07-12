import path from 'path';
import webpack from 'webpack';

// @ts-ignore
import nodeExternals from 'webpack-node-externals';

const config: webpack.Configuration = {
  mode: 'production',
  entry: {
    scriptTop: './custom/scripts/script-top.ts',
    scriptBottom: './custom/scripts/script-bottom.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(process.cwd(), 'build/public'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      app: path.resolve(process.cwd(), 'app/'),
      starter: path.resolve(process.cwd(), 'starter/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              "@babel/preset-typescript",
            ]
          }
        },
      },
    ]
  },
  plugins: [],
  externalsPresets: { node: true },
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
