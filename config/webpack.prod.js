const path = require('path')
const moment = require('moment')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const settings = require('../settings/core').build
const assets = settings.assets
const baseWebpackConfig = require('./webpack.base')

const resolve = dir => path.join(__dirname, '..', dir)

const assetsPath = curPath => path.posix.join(assets.subDir, curPath)

const webpackConfig = merge(baseWebpackConfig, {
  devtool: settings.sourceMap ? '#source-map' : false,
  output: {
    path: assets.root,
    publicPath: settings.publicPath,
    filename: assetsPath(`${assets.jsDir}/[name].[${settings.jsHashType}].js`),
    chunkFilename: assetsPath(`${assets.jsDir}/[id].[name].[${settings.jsHashType}].js`)
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': settings.env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      comments: false,
      sourceMap: settings.sourceMap
    }),
    new ExtractTextPlugin({
      filename: assetsPath(`${assets.cssDir}/[name].[${settings.cssHashType}].css`),
      allChunks: true
    }),
    new OptimizeCSSPlugin(),
    new HtmlWebpackPlugin({
      extJS: settings.extJS || [],
      extCSS: settings.extCSS || [],
      title: settings.projectName,
      remoteLog: false,
      isMobile: settings.isMobile,
      filename: assetsPath(assets.htmlFileName),
      favicon: resolve('public/favicon.ico'),
      template: resolve('static/index.ejs'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => resource && resource.indexOf(path.join(__dirname, '../node_modules')) >= 0
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new CopyWebpackPlugin([{
      from: resolve('public'),
      to: assets.subDir,
      ignore: ['.*']
    }])
  ]
})

if (settings.gzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(`\\.(${settings.gzipExtensions.join('|')})$`),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: `../data/reports/${moment().format('YYYYMMDDHHmmss')}.html`
  }))
}

module.exports = webpackConfig
