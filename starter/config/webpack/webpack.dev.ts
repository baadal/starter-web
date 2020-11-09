import { Configuration,  WebpackPluginInstance } from 'webpack';

const devConfig = (env: any) => {
  const plugins: WebpackPluginInstance[] = [];

  const config: Configuration = {
    mode: 'development',
    optimization: {
      minimize: false,
      splitChunks: false
    },
    plugins,
  };

  return config;
};

export default devConfig;
