var lib = require('../../lib')


module.exports = function configKnex (vfs, baseConfig, moduleArgs) {

  if ( ! baseConfig.package.addedPultModules.includes('knex') ) {
    throw new lib.errors.MissingDependency('knex')
  }

  return {}
}
