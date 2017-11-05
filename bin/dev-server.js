const check = require('./check-versions')
const settings = require('../settings/core').dev
settings.checkVersions && check()

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(settings.env.NODE_ENV)
}

const ip = require('ip')
const ora = require('ora')
const opn = require('opn')
const path = require('path')
const http = require('http')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const socket = require('socket.io')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('../config/webpack.dev')

const proxyTable = settings.proxyTable

const isTest = process.env.NODE_ENV === 'testing'

const port = process.env.PORT || settings.port
const openBrowser = settings.openBrowser
const app = express()
let httpServer = app

if (process.env.npm_config_log) {
  console.log(chalk.green('Opening remote logging service...\n'))
  httpServer = http.Server(app)
  const io = socket(httpServer)
  io.on('connection', socket => {
    socket.on('log', info => {
      console.log(info)
    })
    socket.on('log:success', info => {
      console.log(chalk.green(info))
    })
    socket.on('log:error', info => {
      console.log(chalk.red(info))
    })
    socket.on('log:warn', info => {
      console.log(chalk.yellow(info))
    })
  })
}

const compiler = webpack(webpackConfig)
const spinner = ora('building for development...')
spinner.start()

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: settings.publicPath,
  quiet: true,
  stats: {
    colors: true
  }
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})

compiler.plugin('compilation', compilation => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({
      action: 'reload'
    })
    cb()
  })
})

Object.keys(proxyTable).forEach(context => {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  options.onProxyReq = (proxyReq, req, res) => {
    console.log(`[${chalk.gray('proxy')}]: ${chalk.yellow(proxyReq.path)}`)
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(require('connect-history-api-fallback')())

app.use(devMiddleware)

app.use(hotMiddleware)

const staticPath = path.posix.join(settings.publicPath, settings.assets.subDir)
app.use(staticPath, express.static('./public'))

const uri = `http://${ip.address()}:${port}`

let _resolve
const readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log(chalk.blue('> Starting dev server...'))
devMiddleware.waitUntilValid(() => {
  spinner.stop()
  console.log(chalk.cyan(`> Listening at ${uri} \n`))
  if (openBrowser && !isTest && !process.env.npm_config_silence) {
    opn(uri)
  }
  _resolve()
})

const server = httpServer.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
