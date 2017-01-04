var Path = require('path')
var express = require('express')

var isProduction = (process.env.NODE_ENV === 'production')

var clientDir = Path.resolve(process.cwd(), './client')
var publicDir = `${clientDir}/public`
var staticDir = `${clientDir}/public/static`
var pagesDir  = `${clientDir}/pages`


exports.mount = function mountMarko (router) {

  router.use(function (req, res, next) {
    //
    // Attach custom res.renderPage() method for convenience
    //
    res.renderPage = function (filePath, templateData) {
      var templatePath = Path.resolve(`${pagesDir}/${filePath}`, 'index.marko')
      var template = require( templatePath )

      res.marko(template, templateData)
    }
    next()
  })

  router.use( express.static(publicDir) )

  router.use('/', require('../render-html'))
}


//
// Marko Configuration
//
require('marko-magic')

require('marko/node-require').install()                      // Allow requiring *.marko files
require('lasso/node-require-no-op').enable('.less', '.css'); // Allow importing *.css and *.less files

require('marko/compiler/config').meta = true
require('marko/compiler/config').writeToDisk = isProduction

// Enable res.marko
require('marko/express')

// Browser Refresh on file changes
require('marko/browser-refresh').enable()
require('lasso/browser-refresh').enable('*.marko *.css *.less *.png *.jpeg *.jpg *.gif *.webp *.svg')

//
// Lasso bundling (marko-friendly alternative to browserify)
//
require('lasso').configure({
  plugins: [
    require('lasso-marko'), // Auto compile Marko template files
  ],

  // Directory where generated JS and CSS bundles are written
  outputDir: staticDir,

  // URL prefix for static assets
  urlPrefix: '/static',

  // Only bundle up JS and CSS files in production builds
  bundlingEnabled: isProduction,

  // Only minify JS and CSS files in production builds
  minify: isProduction,

  // Only fingerprint JS and CSS files in production builds
  fingerprintsEnabled: isProduction
})
