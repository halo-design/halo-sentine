const webpack = require('webpack')
const settings = require('../settings/core').test
const baseWebpackConfig = require('./webpack.base')

module.exports = {
  output: baseWebpackConfig.output,
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: baseWebpackConfig.resolve.alias
  },
  module: baseWebpackConfig.module,
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': settings.env
    })
  ]
}
