const path = require('path')
const webpack = require('webpack')
const settings = require('../settings/core')
const styleLoader = require('./style-loader')

const isProd = process.env.NODE_ENV === 'production'
const env = isProd ? 'build' : 'dev'
const assetsPath = curPath => path.posix.join(settings[env].assets.subDir, curPath)
const resolve = dir => path.join(__dirname, '..', dir)
const publicPath = dir => settings[env].publicPath + dir

let loaderRules = [
  {
    test: /\.(js|jsx)$/,
    loader: 'babel-loader',
    include: [resolve('src'), resolve('test')]
  }, {
    test: /\.css$/,
    use: styleLoader()
  }, {
    test: /\.less$/,
    use: styleLoader('less-loader')
  }, {
    test: /\.(scss|sass)$/,
    use: styleLoader('sass-loader')
  }, {
    test: /\.(stylus|styl)$/,
    use: styleLoader('stylus-loader')
  }, {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    query: {
      limit: 8192,
      name: assetsPath('images/[name].[hash:7].[ext]')
    }
  }, {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    query: {
      limit: 8192,
      name: assetsPath('fonts/[name].[hash:7].[ext]')
    }
  }, {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: assetsPath('media/[name].[hash:7].[ext]')
    }
  }
]

if (settings[env].lint && !process.env.npm_config_nolint) {
  loaderRules = [{
    test: /\.(js|jsx)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
      formatter: require('eslint-friendly-formatter')
    }
  }].concat(loaderRules)
}

let plugins = [
  new webpack.optimize.ModuleConcatenationPlugin()
]

module.exports = {
  entry: {
    app: './src/core/main.js'
    // vendor: []
  },
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      '~': resolve('src'),
      '@': resolve('src/views'),
      '#': resolve('src/assets'),
      '&': resolve('src/models'),
      '^': resolve('src/components')
    }
  },
  module: {
    rules: loaderRules
  },
  plugins: plugins
}
