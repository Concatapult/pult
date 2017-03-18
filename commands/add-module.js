var Path = require('path')
var semver = require('semver')
var semverIntersect = require('semver-set').intersect

var colors = require('../lib/colors')
var errors = require('../lib/errors')

var IMAGE_EXTS = 'png,jpg'


module.exports = function addModule (vfs, baseConfig, moduleName, moduleArgs) {

  baseConfig.package.addedPultModules = baseConfig.package.addedPultModules || []

  var addedModules = baseConfig.package.addedPultModules

  if ( addedModules.includes(moduleName) ) {
    throw new errors.ModuleError(`Module ${colors.subject(moduleName)} is already a part of this project.`)
  }

  var config = require(`../modules/${moduleName}/config`);

  if ( moduleArgs.length > config.maxCLIArgs ) {
    throw new errors.TooManyArguments(moduleName, config.maxCLIArgs)
  }

  for (var conflict of config.pultModuleConflicts) {
    if ( baseConfig.package.addedPultModules.includes(conflict) ) {
      throw new errors.IncompatibleModule(moduleName, conflict)
    }
  }

  for (var dep of config.pultModuleDeps) {
    if ( ! baseConfig.package.addedPultModules.includes(dep) ) {
      throw new errors.MissingDependency(dep)
    }
  }

  var moduleConfig = config.get(vfs, baseConfig, moduleArgs)

  var newPackage = Object.assign({}, baseConfig.package, moduleConfig.package || {}, {
    addedPultModules: addedModules.concat([moduleName])
  })

  if ( moduleConfig.dependencies || moduleConfig.devDependencies ) {
    // package-merge wants strings :(
    Object.assign(newPackage, {
      dependencies:    mergeDeps( baseConfig.package.dependencies,    moduleConfig.dependencies    ),
      devDependencies: mergeDeps( baseConfig.package.devDependencies, moduleConfig.devDependencies ),
    })
  }

  if ( moduleConfig.server ) {
    writeJSON(vfs, baseConfig.projectRoot + '/server/config/index.json', moduleConfig.server)
  }

  writeJSON(vfs, baseConfig.projectRoot + '/package.json', newPackage)

  // First copy non-images with support for templating
  var totalConfig = Object.assign({}, baseConfig, moduleConfig)
  vfs.copyTpl([
    $(`modules/${moduleName}/template/{**,*}`),
    `!**/*.{${IMAGE_EXTS}}`,
  ], baseConfig.projectRoot, totalConfig)

  // Then straight copy images
  vfs.copy( $(`modules/${moduleName}/template/**/*.{${IMAGE_EXTS}}`), baseConfig.projectRoot, totalConfig )

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

    return version === dst[dep] && version
      || (isSem ? semverIntersect(version, dst[dep]) || version : version);
  }));
}

function mapValues (obj, fn) {
  var result = {}
  for (var prop in obj) {
    result[prop] = fn(obj[prop], prop)
  }
  return result
}

function writeJSON(vfs, path, value) {
  vfs.write( path, JSON.stringify(value, null, '  ') + '\n' )
}
