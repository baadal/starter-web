import path from 'path';
import { ConfigurationFactory, Plugin } from 'webpack';
import Dotenv from 'dotenv-webpack';

const devConfig: ConfigurationFactory = (env: any) => {
  const plugins: Plugin[] = [
    new Dotenv({ path: path.resolve(process.cwd(), `env/.env.dev`) }),
  ];

  return ({
    mode: 'development',
    optimization: {
      minimize: false,
      splitChunks: false
    },
    plugins,
  });
};

export default devConfig;
