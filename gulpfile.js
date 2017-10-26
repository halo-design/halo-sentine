const fs = require('fs')
const opn = require('opn')
const pug = require('pug')
const gulp = require('gulp')
const path = require('path')
const chalk = require('chalk')
const sftp = require('gulp-sftp')
const ncu = require('npm-check-updates')
const tools = require('./bin/analyze-tools')

gulp.task('dev', () => {
  require('./bin/dev-server')
})

gulp.task('build', () => {
  require('./bin/production')
})

gulp.task('upload', () =>
  gulp.src('dist/**')
    .pipe(sftp({
      host: '139.224.128.69',
      auth: 'nginxAdmin',
      remotePath: '/home/nginx/www/ydkf/halo'
    }))
)

gulp.task('upload-diff', () =>
  gulp.src('dist_diff/**')
    .pipe(sftp({
      host: '139.224.128.69',
      user: 'nginx',
      auth: 'nginxAdmin',
      remotePath: '/home/nginx/www/ydkf/halo'
    }))
)

gulp.task('snapshot', () => {
  tools.getSnapshots('dist', 'data/snapshots')
})

gulp.task('dist-different', () => {
  tools.distDiffer('data/compare.json', 'dist_diff')
})

gulp.task('compare', () => {
  let shotArr = []
  const relPath = 'data/snapshots'
  tools.readDir(path.resolve(), relPath, (curPath, filename, cb) => {
    shotArr.push(filename.split('.')[0] * 1)
  })
  shotArr = shotArr.sort((a, b) => b - a)

  if (shotArr.length > 1) {
    tools.compare({
      source: `${relPath}/${shotArr[1]}.json`,
      target: `${relPath}/${shotArr[0]}.json`,
      compArr: ['css', 'js', 'images', 'fonts', 'static'],
      logPath: 'data',
      callback: data => tools.distDiffer(data, 'dist_diff')
    })
  } else {
    console.log(chalk.red('Can not be compared!'))
  }
})

gulp.task('report', () => {
  const rootPath = path.resolve()
  const viewFn = pug.compileFile('./static/report.pug')
  const Data = tools.readJSON(path.join(rootPath, 'data/compare.json'))
  tools.deleteEmptyProperty(Data)
  const reportView = viewFn(Data)
  fs.writeFileSync('./data/compareReport.html', reportView)
  opn('./data/compareReport.html')
})

gulp.task('compare-report', ['compare', 'report'])

gulp.task('dist-server', () => {
  require('./bin/dist-server.js')
})

gulp.task('ncu', () => {
  ncu.run({
    packageFile: 'package.json',
    silent: true,
    jsonUpgraded: true
  }).then(upgraded => {
    console.log('dependencies to upgrade: \n', upgraded)
  })
})
