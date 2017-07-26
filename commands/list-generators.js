var fs = require('fs')
var Path = require('path')
var Promise = require('bluebird')
var colors = require('../lib/colors')

readDir = Promise.promisify(fs.readdir);

module.exports = function listGenerators (baseConfig, args=[]) {
  return Promise.all([
   readDir( Path.resolve( __dirname, '../built-in-generators' ) ).catch(() => []),
   readDir( `${baseConfig.projectRoot}/generators/` ).catch(() => []) 
  ])
  .then(arr => arr[0].concat(arr[1])
    .filter((gen, idx, collection) => collection.indexOf(gen) === idx) // unique
    .map(colors.fileMod)
    .join('\n    ')
  )
  .then(generators => `
  List of all available generators:

    ${generators}

  Some modules will expose generator(s) upon installation.

  To run a generator:
    $ pult generate <generator>
`)
}
