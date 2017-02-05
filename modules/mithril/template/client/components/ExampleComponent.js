//
// An example component.
//
// See docs on components here: http://mithril.js.org/components.html
//
var m = require('mithril')


var ExampleComponent = module.exports

ExampleComponent.view = function (vnode) {
  return m('.my-component',
    m('h2', vnode.attrs.title)
  )
}
