const path = require('path')

module.exports = {
  build: {
    env: {
      NODE_ENV: '"production"'
    },
    lint: false,
    isMobile: false,
    assets: {
      root: path.join(__dirname, '../dist'),
      subDir: '',
      htmlFileName: 'index.html',
      cssDir: 'css',
      jsDir: 'js'
    },
    jsHashType: 'chunkhash:8',
    cssHashType: 'contenthash:8',
    publicPath: '/halo/',
    projectName: 'IFP内部管理系统',
    esShim: false,
    sourceMap: false,
    gzip: false,
    gzipExtensions: ['js', 'css'],
    distServerPort: 3030,
    distServerPath: 'dist',
    checkVersions: true
  },
  dev: {
    env: {
      NODE_ENV: '"development"'
    },
    isMobile: false,
    lint: true,
    port: 8080,
    openBrowser: true,
    assets: {
      subDir: ''
    },
    publicPath: '/',
    projectName: 'IFP内部管理系统',
    esShim: false,
    checkVersions: true,
    proxyTable: {
      '/inmanage': {
        target: 'https://flameapp.cn',
        changeOrigin: true
      }
    }
  },
  test: {
    env: {
      NODE_ENV: '"testing"'
    },
    lint: false
  }
}
