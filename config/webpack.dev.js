const ip = require('ip')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const settings = require('../settings/core').dev
const baseWebpackConfig = require('./webpack.base')

const resolve = dir => path.join(__dirname, '..', dir)
const port = process.env.PORT || settings.port

Object.keys(baseWebpackConfig.entry).forEach(name => {
  baseWebpackConfig.entry[name] = ['./config/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  devtool: '#cheap-module-eval-source-map',
  output: {
    publicPath: `http://${ip.address()}:${port}${settings.publicPath}`
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': settings.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      extJS: settings.extJS || [],
      extCSS: settings.extCSS || [],
      title: settings.projectName,
      remoteLog: process.env.npm_config_log,
      isMobile: settings.isMobile,
      filename: 'index.html',
      favicon: resolve('public/favicon.ico'),
      template: resolve('static/index.ejs'),
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
