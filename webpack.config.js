const webpack = require('webpack');
const path = require('path');

module.exports = function (env = {}) {
  const filename = env.mode === 'production' ? 'gl-renderer.min.js' : 'gl-renderer.js';
  const plugins = [];

  if(env.mode === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }));
  }

  plugins.push(new webpack.DefinePlugin({
    __DEV__: env.mode !== 'production',
  }));

  return {
    mode: env.mode || 'none',
    entry: './src/index',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename,
      publicPath: '/js/',
      library: ['GlRenderer'],
      libraryTarget: 'umd',
      libraryExport: 'default',
      globalObject: 'this',
    },
    // resolve: {
    //
    // },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/.*/,
          use: {
            loader: 'babel-loader',
            options: {babelrc: true},
          },
        },
        {
          test: /\.(frag|vert|glsl)$/,
          use: {
            loader: 'glsl-shader-loader',
            options: {},
          },
        },
      ],

      /* Advanced module configuration (click to show) */
    },

    externals: {

    },
    // Don't follow/bundle these modules, but request them at runtime from the environment

    stats: 'errors-only',
    // lets you precisely control what bundle information gets displayed

    devServer: {
      contentBase: path.join(__dirname, env.server || '.'),
      compress: true,
      port: 3000,
      hot: true,
      // ...
    },

    plugins,
    // list of additional plugins

    /* Advanced configuration (click to show) */
  };
};
