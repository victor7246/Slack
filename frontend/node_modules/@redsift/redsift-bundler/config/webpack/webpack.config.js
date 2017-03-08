'use strict';

var webpack = require('webpack'),
  path = require('path'),
  pkg = require(path.join(__dirname, '..', '..', 'package.json'));

var siftRootPath = path.resolve('../');
var debug = process.argv.length > 2 && process.argv[2] === '--rs-debug';

console.log('');
console.log('R> redsift-bundler v' + pkg.version);
console.log('');

if (debug) {
  console.log('R> loading preset "es2015" from:', require.resolve('babel-preset-es2015'));
  console.log('R> loading preset "react" from:', require.resolve('babel-preset-react'));
  console.log('R> loading preset "stage-0" from:', require.resolve('babel-preset-stage-0'));
  console.log('');
  console.log('R> add folder to resolve list:', siftRootPath);
  console.log('');
}

module.exports = {
  cache: true,
  resolve: {
   // NOTE: resolves to $PROJECT_ROOT/ and allows to include files from there. E.g., to include a file from
   // $PROJECT_ROOT/server use 'import settings from "server/settings.js"'.
   root: [ siftRootPath ],
   extensions: [ '', '.js', '.jsx', '.json', '.tmpl' ]
  },
  // NOTE: keeping that here in case it is necessary in the future (see https://webpack.github.io/docs/configuration.html#module-loaders):
  // resolveLoader: {
  //   root: [path.resolve('./node_modules')]
  // },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            // NOTE: use 'require.resolve' here as the presets are located in redsift-bundler's node_modules. If only
            // listing the presets as ['es2015', 'react'] they would be resolved from $PROJECT_ROOT, which fails if
            // they are not explicitly installed there.
            // See https://github.com/babel/babel-loader/issues/149 for a discussion on the topic.
            require.resolve('babel-preset-es2015'),
            require.resolve('babel-preset-react'),
            require.resolve('babel-preset-stage-0'),
          ]
        }
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.tmpl$/, loader: 'html-loader' },
    ],
    // NOTE: keeping that here as a reference on how to use query configuration for loaders:
    // loaders: [{
    //   test: /\.jsx?$/,
    //   loaders: ['babel?presets[]=es2015,presets[]=stage-0,presets[]=react,plugins[]=transform-runtime,cacheDirectory'],
    //   // include: [
    //   //   path.join(__dirname, 'components')
    //   // ]
    // }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      VERSION: JSON.stringify(pkg.version)
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  devtool: 'source-map',
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
