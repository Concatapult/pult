var Path = require('path')
global.CONFIG = require('./index.json')
CONFIG.projectFile = (path) => Path.resolve(__dirname, '../..', path)


module.exports = function config (router) {
  for (var item of CONFIG.routerPipeline) {
    require(item).mount(router)
  }
}
