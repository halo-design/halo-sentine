const ip = require('ip')
const opn = require('opn')
const chalk = require('chalk')
const express = require('express')
const tools = require('./analyze-tools')
const settings = require('../settings/core')
const devices = require('../settings/devices')
const routes = require('../settings/routes')
const history = require('connect-history-api-fallback')
const proxyMiddleware = require('http-proxy-middleware')
const proxyTable = settings.dev.proxyTable

const app = express()
const port = settings.build.distServerPort
const publicPath = settings.build.publicPath
const distServerPath = settings.build.distServerPath
const uri = `http://${ip.address()}:${port}${publicPath}`

const staticFileMiddleware = express.static(distServerPath)

app.use('/mock', express.static('./mock'))

app.use(history({
  index: `${publicPath}index.html`
}))

app.use(publicPath, staticFileMiddleware)

app.listen(port, error => {
  if (error) {
    throw error
  }
  console.log(chalk.green(`Server is running at ${uri}`))
  process.env.npm_config_opn && opn(uri)
  const genShot = async () => {
    for (let route of routes) {
      const fullPath = uri + route.path
      await tools.screenshot(fullPath, devices, route.name, route.delay)
    }
    console.log(chalk.yellow('\nScreen capture have already done!\n'))
  }
  process.env.npm_config_shot && genShot()
})

Object.keys(proxyTable).forEach(context => {
  const options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  options.onProxyReq = (proxyReq, req, res) => {
    console.log(`[${chalk.gray('proxy')}]: ${chalk.yellow(proxyReq.path)}`)
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(require('connect-livereload')())