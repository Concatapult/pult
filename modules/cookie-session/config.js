var lib = require('../../lib')


module.exports = {
  maxCLIArgs: 0,
  pultModuleDeps: [],
  pultModuleConflicts: [],
  get: function get (vfs, baseConfig, moduleArgs) {

    var serverConfig = lib.clone(baseConfig.server)

    serverConfig.routerPipeline.push('./cookie-sessions.js')

    var config = {
      dependencies: {
        "cookie-session": "*",
      },
      server: serverConfig,
    }

    config.installs = Object.keys(config.dependencies)

    return config
  }
}
