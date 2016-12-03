var lib = require('../../lib')


module.exports = function configClient (vfs, baseConfig, moduleArgs) {
  if ( moduleArgs.length >= 2 ) {
    throw new lib.errors.ModuleError('Module `spa` only takes 1 argument')
  }

  var serverConfig = lib.clone(baseConfig.server)

  serverConfig["spa"] = {
    "browserify": {
      "external": []
    }
  }

  serverConfig.routerPipeline.unshift('./config/client-bundles.js')
  serverConfig.routerPipeline.push('./config/catch-all-index-page.js')

  var config = {
    dependencies: {
      "browserify-middleware": "^7.1.0",
    },
    server: serverConfig,
  }

  config.installs = Object.keys(config.dependencies)

  return config
}
