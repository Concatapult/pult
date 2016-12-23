var lib = require('../../lib')


module.exports = function configCookieSession (vfs, baseConfig, moduleArgs) {
  if ( moduleArgs.length >= 2 ) {
    throw new lib.errors.ModuleError('Module `cookie-sessions` only takes 1 argument')
  }

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
