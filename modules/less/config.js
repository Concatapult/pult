var lib = require('../../lib')


module.exports = {
  maxCLIArgs: 0,
  pultModuleDeps: [],
  pultModuleConflicts: [],
  get: function get (vfs, baseConfig, moduleArgs) {

    var serverConfig = lib.clone(baseConfig.server)

    serverConfig.routerPipeline.unshift('./style-bundles.js')


    //
    // Inject link tag into main html file
    //
    var isSpa   = baseConfig.package.addedPultModules.includes('spa')
    var isMarko = baseConfig.package.addedPultModules.includes('marko')

    if ( isSpa || isMarko ) {
      var htmlPath = baseConfig.projectRoot + (
        isSpa ? '/client/public/index.html' : '/client/pages/_layouts/main.marko'
      )

      var html     = vfs.read(htmlPath)

      var spaces = html.match(/( *)<\/head>/)[1]
      var result = html.replace(
        '</head>',
        `  <link rel="stylesheet" type="text/css" href="/app-bundle.css">\n${ spaces }</head>`
      )
      vfs.write(htmlPath, result)
    }


    var config = {
      dependencies: {
        "node-less-endpoint": "0.x",
      },
      server: serverConfig,
    }

    config.installs = Object.keys(config.dependencies)

    return config
  }
}
