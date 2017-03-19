var lib = require('../../lib')


module.exports = {
  maxCLIArgs: 0,
  pultModuleDeps: [ 'spa' ],
  pultModuleConflicts: [ 'marko', 'mithril' ],
  get: function get (vfs, baseConfig, moduleArgs) {

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
}
