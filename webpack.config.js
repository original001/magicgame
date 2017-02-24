const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {

    loaders: [{
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
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.ProvidePlugin({
      SAT: 'sat'
    })
  ]
};