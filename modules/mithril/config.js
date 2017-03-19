var lib = require('../../lib')


module.exports =  {
  maxCLIArgs: 0,
  pultModuleDeps: [ 'spa' ],
  pultModuleConflicts: [ 'marko', 'react' ],
  get: function get (vfs, baseConfig, moduleArgs) {

    var serverConfig = lib.clone(baseConfig.server)
    serverConfig["spa"]["browserify"]["external"].push('mithril')


    var config = {
      dependencies: {
        "mithril": "^1.0.0",
      },
      server: serverConfig,
    }

    config.installs = Object.keys(config.dependencies)

    return config
  }
}
