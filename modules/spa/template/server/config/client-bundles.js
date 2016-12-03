var express = require('express')
var browserify = require('browserify-middleware')
var Path = require('path')

var assetFolder = Path.resolve(__dirname, '../../client/public')


exports.mount = function clientBundleSetup (router) {
  //
  // Provide browserified files at specified paths
  //
  router.get('/vendor-bundle.js', browserify(CONFIG.spa.browserify.external))

  router.get('/app-bundle.js', browserify('./client/index.js', CONFIG.spa.browserify))

  //
  // Static assets (html, etc.)
  //
  router.use(express.static(assetFolder))
}

exports.getAssetFolder = function () { return assetFolder }
