var lib = require('../../lib')


module.exports = {
  maxCLIArgs: 0,
  pultModuleDeps: [],
  pultModuleConflicts: [],
  get: function get (vfs, baseConfig, moduleArgs) {

    var serverConfig = lib.clone(baseConfig.server)
    serverConfig.foundational || (serverConfig.foundational = [])
    serverConfig.foundational.unshift('./typescript.js')

    var setupConfig = lib.clone(baseConfig.serverSetup)
    setupConfig.steps.push('./install-pre-commit-hook.js')

    var config = {
      package: {
        script: Object.assign({}, baseConfig.package.scripts, {
          "pre-commit": "NODE_ENV=check node server/index.js"
        })
      },
      dependencies: {
        "ts-node": "*",
        "typescript": "*",
        "@types/node": "*",
        "@types/express": "*",
      },
      server: serverConfig,
      serverSetup: setupConfig,
    }

    config.installs = Object.keys(config.dependencies)

    //
    // Require hook for test suite
    //
    var helperPath = baseConfig.projectRoot + '/test/test-helper.js'

    var content = vfs.read(helperPath)
    vfs.write(helperPath, content + requireHookForTesting)

    return config
  }
}

//
// To speed up test runs, type checking is disabled by default.
// Typechecking is done on pre-commit, installed on `yarn setup`.
//
var requireHookForTesting = `
require('ts-node').register({
  cache: true,
  cacheDirectory: '.cache/ts',
  fast: true,
  lazy: true,
})
`
