var m = require('mithril')
var ExampleComponent = require('./components/ExampleComponent')

//
// Global variable for global state (e.g. currentUser)
//
window.App = {}

//
// Client-side routing
//
// See docs here: http://mithril.js.org/route.html#typical-usage
//
m.route.prefix = '' // No prefix for full pushstate

m.route(document.getElementById('app'), '/', {

  '/': {

    view: function (ctrl) {
      return m('.app',
        m('h1', 'Hello from Mithril!'),
        m(ExampleComponent, { title: 'Welcome to my app!' })
      )
    }
  }

})
