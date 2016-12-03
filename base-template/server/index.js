process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var express = require('express')
var router = express.Router()

//
// Example endpoint (also tested in test/server/index_test.js)
//
router.get('/api/tags-example', function(req, res) {
  res.send(['node', 'express', 'browserify', 'mithril'])
})


global.CONFIG = require('./config/index.json')

for (var item of CONFIG.routerPipeline) {
  require(item).mount(router)
}

router.get('/', function (req, res) {
  res.send(`
    <h1>Welcome to Concatapult!</h1>
    <p>
      If you're seeing this, it's because you have not yet added a client.
      If you're looking to build a <b>Singe Page App</b>, start by running
      <code>pult add spa</code>
      in your terminal.
    </p>
    <p>For more information, visit
      <a href="https://github.com/Concatapult/pult" target="_blank">the docs</a>.</p>
    <p>Happy pulting!</p>
  `)
})

if (process.env.NODE_ENV !== 'test') {
  //
  // We're in development or production mode;
  // create and run a real server.
  //
  var app = express()

  // Parse incoming request bodies as JSON
  app.use( require('body-parser').json() )

  // Mount our main router
  app.use('/', router)

  // Start the server!
  var port = process.env.PORT || 4000
  app.listen(port)
  console.log("Listening on port", port)
}
else {
  // We're in test mode; make this file importable instead.
  module.exports = router
}
