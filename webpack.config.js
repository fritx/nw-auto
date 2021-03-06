'use strict'
const resolve = require('path').resolve
const webpack = require('webpack')
// const NpmInstallPlugin = require('npm-install-webpack-plugin')
const NotifierPlugin = require('webpack-notifier')

const srcDir = resolve(__dirname, 'src')
const testDir = resolve(__dirname, 'test')
const exampleDir = resolve(__dirname, 'example')
const dirs = [srcDir, testDir, exampleDir]

module.exports = {

  target: 'node-webkit',

  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/webpack/issues/1599
  node: {
    __dirname: false,
    __filename: false,
  },

  // context: __dirname,

  entry: {
    'nw-install-main.js': './src/nw-install-main.js',
    'nw-install-web.js': './src/nw-install-web.js',
    'test.js': './test/index.js',
    'example.js': './example/index.js',
  },

  output: {
    pathinfo: true,
    path: 'dist',
    filename: '[name]',
  },

  module: {
    preLoaders: [
      { test: /\.js$/, include: dirs, loader: 'eslint' },
    ],
    loaders: [
      { test: /\.json$/, exclude: /node_modules/, loader: 'json' },
      { test: /\.js$/, include: dirs, loader: 'babel' },
    ],
  },

  resolve: {
    extensions: ['', '.js'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
  },

  // todo: 分离index.js/nw-install的webpack
  externals: [
    (ctx, req,  cb) => {
      // if (resolve(ctx, req).indexOf(srcDir) !== 0) return cb()
      if (['bluebird', 'nw'].indexOf(req) > -1) {
        return cb(null, `commonjs ${req}`)
      }
      cb()
      // if (/^\.\.?\//.test(req)) return cb()
      // cb(null, `commonjs ${req}`)
    },
  ],

  plugins: [
    // new NpmInstallPlugin({ save: true }),
    new NotifierPlugin({ alwaysNotify: true }),
    new webpack.NoErrorsPlugin(),
    // new webpack.ProvidePlugin({
    //   Promise: 'bluebird',
    // }),
    new webpack.DefinePlugin({
      // rootDir: `"${resolve(__dirname, '..')}"`,
      // $dirname: '__dirname',
    }),
  ],
}
