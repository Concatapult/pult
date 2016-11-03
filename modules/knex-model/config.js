var Errors = require('../../lib/errors')


module.exports = function configKnex (vfs, baseConfig, moduleArgs) {

  if ( ! baseConfig.package.addedPultModules.includes('knex') ) {
    throw new Errors.MissingDependency('knex')
  }

  return {}
}
