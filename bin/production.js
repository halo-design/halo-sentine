const tools = require('./analyze-tools')
const check = require('./check-versions')
process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const settings = require('../settings/core').build
const webpackConfig = require('../config/webpack.prod')

settings.checkVersions && check()

const spinner = ora('building for production...')
spinner.start()

const assets = settings.assets
rm(path.join(assets.root, assets.subDir), err => {
  if (err) {
    throw err
  }
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    console.log(chalk.cyan('Build complete.\n'))
    tools.getSnapshots('dist', 'data/snapshots')
  })
})
