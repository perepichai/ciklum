const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + "/src/index.js", // webpack entry point. Module to start building dependency graph
    output: {
      path: __dirname + '/dist', // Folder to store generated bundle
      filename: 'main.js',  // Name of generated bundle after build
      publicPath: '/' // public URL of the output directory when referenced in a browser
    },
module: {
    rules: [
        {
          test: /\.js$/,
          use: ['babel-loader', 'eslint-loader'],
          exclude: [
            /node_modules/
          ]
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract(
            {
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader']
            })
        }
    ]
},
plugins: [ 
  new ExtractTextPlugin({filename: 'style.css'}),
  new HtmlWebpackPlugin({
    inject: false,
    hash: true,
    template: './src/index.html',
    filename: 'index.html'
  })
]
};