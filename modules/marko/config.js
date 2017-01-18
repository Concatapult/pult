var lib = require('../../lib')


module.exports = function configClient (vfs, baseConfig, moduleArgs) {
  if ( moduleArgs.length >= 2 ) {
    throw new lib.errors.ModuleError('Module `marko` only takes 1 argument')
  }

  if ( baseConfig.package.addedPultModules.includes('spa') ) {
    throw new lib.errors.ModuleError('Module `marko` is incompatible with the module `spa`')
  }


  var serverConfig = lib.clone(baseConfig.server)

  serverConfig.routerPipeline.unshift('./marko.js')

  var config = {
    package: {
      scripts: {
        start: "./node_modules/.bin/browser-refresh server/index.js"
      }
    },
    dependencies: {
      "less": "^2.7",
      "lasso": "^2.8.3",
      "lasso-marko": "^2.1.0",
      "lasso-less": "^2.1.0",
      "marko": "v4.0.0-rc.3",
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
