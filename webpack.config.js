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
  entry: ['babel-polyfill','./graphql-example/index.js'],
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'backend.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeModules,
  plugins: [
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
          presets: [['es2015', {modules: false}]],
          plugins: ["transform-object-rest-spread"]
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
}