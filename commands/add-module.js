var fs   = require('fs')
var Path = require('path')
var semver = require('semver')
var semverIntersect = require('semver-set').intersect


module.exports = function addModule (vfs, baseConfig, moduleName, moduleArgs) {
  try {
    console.log("Checking", $(`modules/${moduleName}/template/**`))
    fs.accessSync($(`modules/${moduleName}`))
  }
  catch (e) {
    throw new Error(`pult: Module '${moduleName}' does not exist.`)
  }

  var config = require(`../modules/${moduleName}/config`)
  var moduleConfig = config(vfs, baseConfig, moduleArgs)

  if ( moduleConfig.dependencies || moduleConfig.devDependencies ) {
    // package-merge wants strings :(
    var newPackage = Object.assign({}, baseConfig.package, {
      dependencies:    mergeDeps( baseConfig.package.dependencies,    moduleConfig.dependencies    ),
      devDependencies: mergeDeps( baseConfig.package.devDependencies, moduleConfig.devDependencies ),
    })

    vfs.write( baseConfig.projectRoot + '/package.json', JSON.stringify(newPackage, null, '  ') )
  }

  var totalConfig = Object.assign({}, baseConfig, moduleConfig)
  vfs.copyTpl( $(`modules/${moduleName}/template/{**,.*}`), baseConfig.projectRoot, totalConfig )

  return moduleConfig
}

//
// Utility
//
var pultDir = Path.resolve(__dirname, '..')
var $ = (path) => Path.resolve(pultDir, path)

function mergeDeps (dst, src) {
  if ( ! src ) return dst
  if ( ! dst ) return src
  return Object.assign({}, dst, mapValues(src, function(version, dep) {
    // We need to check if both are indeed semver ranges in order to do
    // intersects – some may be git urls or other such things.
    var isSem = semver.validRange(version) && semver.validRange(dst[dep]);
    return isSem ? semverIntersect(version, dst[dep]) || version : version;
  }));
}

function mapValues (obj, fn) {
  var result = {}
  for (var prop in obj) {
    result[prop] = fn(obj[prop], prop)
  }
  return result
}
