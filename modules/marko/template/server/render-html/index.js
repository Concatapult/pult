//
// If an endpoint starts getting too big,
// you can move it into its own file within render-html/
// and require it here.
//
// var API = require('../lib/api-helpers')


var router = module.exports = require('express').Router()

router.get('/', function (req, res) {
  // This renders client/pages/home/index.marko
  res.renderPage('home', { initialCount: 10 })
})

/* [[pultPlaceholder]] */
