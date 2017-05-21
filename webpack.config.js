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
      loader: 'babel?presets[]=es2015!ts-loader',
    },{
      test: /\.js/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0']
      }
    },{
      test: /\.json/,
      loader: 'json'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
};
