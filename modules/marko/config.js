var lib = require('../../lib')


module.exports = {
  maxCLIArgs: 0,
  pultModuleDeps: [],
  pultModuleConflicts: [ 'spa' ],
  get: function get (vfs, baseConfig, moduleArgs) {

    var serverConfig = lib.clone(baseConfig.server)

    serverConfig.routerPipeline.unshift('./marko.js')

    var config = {
      package: {
        scripts: {
          start: baseConfig.package.scripts.start,
          watch: "./node_modules/.bin/browser-refresh server/index.js"
        }
      },
      dependencies: {
        "less": "^2.7",
        "lasso": "^2.11",
        "lasso-marko": "^2.3",
        "lasso-less": "^2.1",
        "marko": "^4.2",
        "marko-magic": "Concatapult/marko-magic",
        "browser-refresh-taglib": "*",
      },
      devDependencies: {
        "browser-refresh": "^1.7.0",
      },
      server: serverConfig,
    }

    config.installs = Object.keys(config.dependencies)


    // git ignore generated files
    var gitignorePath = baseConfig.projectRoot + '/.gitignore'
    var gitignore     = vfs.read(gitignorePath)
    vfs.write(gitignorePath, gitignore + '\n*.marko.js\n.cache/\nclient/public/static/\n')

    return config
  }
}
