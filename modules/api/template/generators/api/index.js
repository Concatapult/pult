var Path = require('path')

var usageDocs = (name, namePlural) => `
\`pult add api ${name}\` requires one more argument - the endpoints you want generated. For example:

    $ pult add api ${name} all

will generate all endpoints, whereas the following will only generate a few:

    $ pult add api ${name} 014

Here are the available numerical options:

    0 - GET    /${ namePlural }
    1 - POST   /${ namePlural }
    2 - GET    /${ namePlural }/:id
    3 - PUT    /${ namePlural }/:id
    4 - DELETE /${ namePlural }/:id
`


module.exports = function * generateApi (util, vfs, config, name, endpointString) {

  if ( ! name ) {
    name = ( yield util.prompt('Name of API (users, comments, etc.): ') )
          || util.fail('`pult generate api` requires an API name.')
  }

  name = util.inflection.singularize(name)
  var namePlural = util.inflection.pluralize(name)

  if ( ! endpointString ) {
    console.log( usageDocs(name, namePlural) )
    endpointString = yield util.prompt(
      'Enter which endpoints to generate (all, none, 0, 01, 013, etc.)\n[default is none]: ')
  }

  var endpoints = new Array(5).fill(false)

  endpointString
    .replace('all', '01234') // resolve alias
    .replace(/[^0-4]/g, '')  // strip invalid characters
    .split('')
    .forEach( i => endpoints[i] = true ) // toggle endpoints

  var templateVars = {
    endpoints: endpoints,

    modelName: util.inflection.capitalize(name),

    name: name,
    nameCapitalized: util.inflection.capitalize(name),

    namePlural: namePlural,
    namePluralCapitalized: util.inflection.capitalize(namePlural),
  }

  vfs.copyTpl(
    util.projectFile(`generators/api/endpoints-template.ejs`),
    util.projectFile(`server/apis/${ namePlural }-api.js`),
    templateVars
  )
  vfs.copyTpl(
    util.projectFile(`generators/api/endpoints-test-template.ejs`),
    util.projectFile(`test/server/apis/${ namePlural }-api-test.js`),
    templateVars
  )

  // Mount new API endpoints
  var indexFilePath = util.projectFile('server/apis/index.js')
  var indexFile     = vfs.read(indexFilePath)

  var i = indexFile.indexOf('[[pultPlaceholder]]')

  if ( i || i === 0 ) {
    var startPosition = indexFile.lastIndexOf('\n', i) + 1
    var output = indexFile.substr(0, startPosition)
      + `router.use('/', require('./${ namePlural }-api'))\n`
      + indexFile.substr(startPosition)

    vfs.write(indexFilePath, output)
  }
}
