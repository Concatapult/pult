var Path = require('path')
global.CONFIG = require('./index.json')
CONFIG.projectFile = (path) => Path.resolve(__dirname, '../..', path)


module.exports = function config (router) {

  //
  // Foundational config should be seldom used,
  // as it has a HIGH priority over the rest.
  //
  for (var item of (CONFIG.foundational || [])) {
    require(item).mount(router)
  }

  //
  // Run the rest of all configuration.
  //
  for (var item of CONFIG.routerPipeline) {
    require(item).mount(router)
  }
}
