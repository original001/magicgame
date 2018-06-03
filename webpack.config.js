const webpack = require('webpack');

module.exports = {
  entry: './index',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    {
      test: /\.ts/,
      loader: 'ts-loader',
    },{
      test: /\.json/,
      loader: 'json'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
};
