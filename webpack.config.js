const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const WebpackNodeServerPlugin = require('webpack-node-server-plugin')

let nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = {
  devtool: 'source-map',
  entry: ['babel-polyfill','./server.js'],
  target: 'node',
  output: {
    path: process.env.NODE_ENV === 'production' ? path.join(__dirname, 'dist') : path.join(__dirname, 'build'),
    filename: 'backend.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeModules,
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new WebpackNodeServerPlugin({retries: 0}),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [['es2015', {modules:false}]]
        }
      }
    ]
  }
}