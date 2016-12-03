var Path = require('path')
var clientConfig = require('./client-bundles')


exports.mount = function clientBundleSetup (router) {
  //
  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST in routerPipeline.
  //
  router.get('/*', function(req, res){
    res.sendFile( Path.resolve(clientConfig.getAssetFolder(), './index.html') )
  })
}
