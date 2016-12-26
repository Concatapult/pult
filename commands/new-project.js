var Path = require('path')


module.exports = function createProject (vfs, baseConfig, projectName) {
  var dest = Path.resolve(baseConfig.cwd, projectName)
  vfs.copyTpl( $('base-template/{**,.*}'), dest, baseConfig )

  //
  // npm short-sightedly renames a publish .gitignore file to .npmignore
  //
  vfs.move(`${dest}/gitignore`, `${dest}/.gitignore`)
}

//
// Utility
//
var pultDir = Path.resolve(__dirname, '..')
var $ = (path) => Path.resolve(pultDir, path)
