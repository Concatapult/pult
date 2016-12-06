var express = require('express')
var LESS = require('node-less-endpoint')

exports.mount = function clientBundleSetup (router) {
  //
  // Provide a bundled css file at specified endpoint.
  // See https://github.com/Concatapult/node-less-endpoint for more information.
  //
  router.get('/app-bundle.css',
    LESS.serve( CONFIG.projectFile('client/styles/index.less')))
}
