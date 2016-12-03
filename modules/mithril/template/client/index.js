var m = require('mithril')
var ExampleComponent = require('./components/ExampleComponent')

//
// Global variable for global state (e.g. currentUser)
//
window.App = {}

//
// Client-side routing
//
m.route.mode = 'pathname'
m.route(document.getElementById('app'), '/', {

  '/': {
    // Controllers are optional
    // controller: function () {},

    view: function (ctrl) {
      return m('.app', [
        m('h1', 'Hello from Mithril!'),
        m.component(ExampleComponent, { title: 'Welcome to my app!' })
      ])
    }
  }

})
