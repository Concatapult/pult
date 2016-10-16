var Path = require('path')


module.exports = function createProject (vfs, baseConfig, projectName) {
  var dest = Path.resolve(baseConfig.cwd, projectName)
  vfs.copyTpl( $('base-template/**'), dest, baseConfig )
}

//
// Utility
//
var pultDir = Path.resolve(__dirname, '..')
var $ = (path) => Path.resolve(pultDir, path)
