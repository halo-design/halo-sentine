const chalk = require('chalk')
const semver = require('semver')
const packageConfig = require('../package.json')

const exec = cmd => require('child_process').execSync(cmd).toString().trim()

let versionRequirements = [{
  name: 'node',
  currentVersion: semver.clean(process.version),
  versionRequirement: packageConfig.engines.node
}, {
  name: 'npm',
  currentVersion: exec('npm --version'),
  versionRequirement: packageConfig.engines.npm
}]

console.log(chalk.green('Start checking version...'))

module.exports = () => {
  let warnings = []
  versionRequirements.forEach(mod => {
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(`${mod.name} : ${chalk.red(mod.currentVersion)} should be ${chalk.green(mod.versionRequirement)}`
      )
    }
  })

  if (warnings.length) {
    console.log(chalk.yellow('To use this template, you must update following to modules:\n'))
    warnings.forEach(warning => {
      console.log(`> ${warning}\n`)
    })
    process.exit(1)
  }
}
