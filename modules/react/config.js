var lib = require('../../lib')


module.exports = function configClient (vfs, baseConfig, moduleArgs) {
  if ( ! baseConfig.package.addedPultModules.includes('spa') ) {
    throw new lib.errors.MissingDependency('spa')
  }

  if ( moduleArgs.length >= 2 ) {
    throw new lib.errors.ModuleError('Module `react` only takes 1 argument')
  }

  var serverConfig = lib.clone(baseConfig.server)

  var browserify = serverConfig["spa"]["browserify"]

  browserify.transform = browserify.transform || []
  browserify.transform.unshift('reactify')

  browserify.external.push('react', 'react-dom')

  var config = {
    dependencies: {
      "react": "*",
      "react-dom": "*",
      "reactify": "*",
    },
    server: serverConfig,
  }

  config.installs = Object.keys(config.dependencies)

  return config
}
