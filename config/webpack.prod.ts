import path from 'path';
import { WebpackPluginInstance } from 'webpack';
import Dotenv from 'dotenv-webpack';

const prodConfig = (env: any) => {
  const plugins: WebpackPluginInstance[] = [
    new Dotenv({ path: path.resolve(process.cwd(), `env/.env.prod`) }),
  ];

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
