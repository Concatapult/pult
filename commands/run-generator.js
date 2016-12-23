var co = require('co')
var helpers = require('../lib')
var Path = require('path')


module.exports = co.wrap(function * runGenerator (vfs, baseConfig, name, args=[]) {
  var generator;

  try {
    generator = require(`../built-in-generators/${name}`)
  }
  catch (e) {}

  try {
    generator = generator || require(`${baseConfig.projectRoot}/generators/${name}`)
  }
  catch (err) {
    if ( err.message.match(/Cannot find module/) ) {
      throw new Error(`No such generator: \`${name}\`. Did you forget to \`pult add\` it first?`)
    }
    else throw err
  }

  helpers.projectFile = (path) => Path.resolve(baseConfig.projectRoot, path)
  return co.wrap(generator)(helpers, vfs, baseConfig, ...args)
})
