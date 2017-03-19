var lib = require('../../lib')


module.exports = {
  maxCLIArgs: 0,
  pultModuleDeps: [],
  pultModuleConflicts: [ 'marko' ],
  get: function get (vfs, baseConfig, moduleArgs) {

    var serverConfig = lib.clone(baseConfig.server)

    serverConfig["spa"] = {
      "browserify": {
        "external": []
      }
    }

    serverConfig.routerPipeline.unshift('./client-bundles.js')
    serverConfig.routerPipeline.push('./catch-all-index-page.js')

    var config = {
      dependencies: {
        "browserify-middleware": "^7.1.0",
      },
      server: serverConfig,
    }

    config.installs = Object.keys(config.dependencies)

    return config
  }
}
