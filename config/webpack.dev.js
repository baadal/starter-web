module.exports = (env) => {
  const plugins = [];

  return ({
    mode: 'development',
    optimization: {
      minimize: false,
      splitChunks: false
    },
    plugins,
  });
};
