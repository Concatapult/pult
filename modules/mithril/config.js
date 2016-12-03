var lib = require('../../lib')


module.exports = function configClient (vfs, baseConfig, moduleArgs) {
  if ( ! baseConfig.package.addedPultModules.includes('spa') ) {
    throw new lib.errors.MissingDependency('spa')
  }

  if ( moduleArgs.length >= 2 ) {
    throw new lib.errors.ModuleError('Module `mithril` only takes 1 argument')
  }

  var serverConfig = lib.clone(baseConfig.server)
  serverConfig["spa"]["browserify"]["external"].push('mithril')


  var config = {
    dependencies: {
      "mithril": "^0.2.3",
    },
    server: serverConfig,
  }

  config.installs = Object.keys(config.dependencies)

  return config
}
