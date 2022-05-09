module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-mixins'),
    require('autoprefixer'),
    require('postcss-nested')(),
    require('postcss-global-nested')(),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
