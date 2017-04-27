// webpack.config.js
// Configure CSS processing & injection
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './public/src/main.js',
  output: {
    // Webpack prefers an absolute path:
    path: path.resolve(__dirname, './public/dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        // Uses regex to test for a file type - in this case, ends with `.css`
        test: /\.css$/,
        // Apply these loaders if test returns true
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}