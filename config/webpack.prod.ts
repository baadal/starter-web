import path from 'path';
import { ConfigurationFactory, Plugin } from 'webpack';
import Dotenv from 'dotenv-webpack';

const prodConfig: ConfigurationFactory = (env: any) => {
  const plugins: Plugin[] = [
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
            name(module) {
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
