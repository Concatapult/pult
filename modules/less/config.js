var lib = require('../../lib')


module.exports = function configClient (vfs, baseConfig, moduleArgs) {
  if ( moduleArgs.length >= 2 ) {
    throw new lib.errors.ModuleError('Module `less` only takes 1 argument')
  }

  var serverConfig = lib.clone(baseConfig.server)

  serverConfig.routerPipeline.unshift('./config/style-bundles.js')

  //
  // Inject link tag into main html file
  //
  var htmlPath = baseConfig.projectRoot + '/client/public/index.html'
  var html     = vfs.read(htmlPath)

  var spaces = html.match(/( *)<\/head>/)[1]
  var result = html.replace(
    '</head>',
    `  <link rel="stylesheet" type="text/css" href="/app-bundle.css">\n${ spaces }</head>`
  )
  vfs.write(htmlPath, result)


  var config = {
    dependencies: {
      "node-less-endpoint": "0.x",
    },
    server: serverConfig,
  }

  config.installs = Object.keys(config.dependencies)

  return config
}
