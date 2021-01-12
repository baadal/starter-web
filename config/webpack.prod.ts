import path from 'path';
import { WebpackPluginInstance } from 'webpack';
import Dotenv from 'dotenv-webpack';

// @ts-ignore
import CompressionPlugin from 'compression-webpack-plugin';

import { checkServer } from '../src/utils/env.utils';
import { COMPRESSION_FILES_REGEX } from '../starter/const';
import { existsFile } from '../starter/lib/file-io';

const prodConfig = (env: any) => {
  const isServer = checkServer();

  const plugins: WebpackPluginInstance[] = [
    new Dotenv({ path: path.resolve(process.cwd(), `env/.env.prod`) }),
  ];

  const deployEnvFile = path.resolve(process.cwd(), `env/.env.deploy.tmp`);
  if (existsFile(deployEnvFile, true)) {
    plugins.push(new Dotenv({ path: deployEnvFile }));
  }

  if(!isServer) {
    plugins.push(
      new CompressionPlugin({
        test: COMPRESSION_FILES_REGEX,
        algorithm: 'gzip',
        filename: '[path][base].gz',
      }),
      new CompressionPlugin({
        test: COMPRESSION_FILES_REGEX,
        algorithm: 'brotliCompress',
        filename: '[path][base].br',
      })
    );
  }

  return ({
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) {
              let packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // packageName = packageName.replace('@', '');
              if (packageName === 'react' || packageName === 'react-dom') {
                return 'vendor-react';
              } else {
                return 'vendor-other';
              }
            },
          },
        },
      }
    },
    plugins,
  });
};

export default prodConfig;
