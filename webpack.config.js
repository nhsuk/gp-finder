// webpack.config.js
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.resolve(__dirname, './public/src'),
  entry: {
    app: ['./vendor.js', './events.js', './main.js' ],
  },
  output: {
    path: path.resolve(__dirname, './public/dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}