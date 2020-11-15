const plugins = [
  'autoprefixer',
  'postcss-preset-env',
];

if (process.env.NODE_ENV === 'production') {
  plugins.push('cssnano'); // should be last in plugins array
}

module.exports = {
  plugins
};
