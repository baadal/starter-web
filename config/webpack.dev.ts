import { ConfigurationFactory, Plugin } from 'webpack';

const devConfig: ConfigurationFactory = (env: any) => {
  const plugins: Plugin[] = [];

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
