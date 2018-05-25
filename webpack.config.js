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
  devtool: 'sourcemap',
  target: 'node',
  entry: { main: ['babel-polyfill','./graphql-example/index.js'] },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
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
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};