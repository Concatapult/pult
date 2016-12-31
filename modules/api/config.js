var lib = require('../../lib')


module.exports = function configKnex (vfs, baseConfig, moduleArgs) {

  var serverConfig = lib.clone(baseConfig.server)

  serverConfig.routerPipeline.unshift('./mount-api.js')

  return { server: serverConfig }
}
