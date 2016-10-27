var Path = require('path')


module.exports = function * generateModel (util, vfs, config, name) {

  if ( ! name ) {
    name = ( yield util.prompt('Name of Model (user, comment, etc.): ') )
          || util.fail('`pult generate model` requires a model name.')
  }

  name = util.inflection.singularize(name).toLowerCase()
  var namePlural = util.inflection.pluralize(name)

  var templateVars = {
    name: name,
    nameCapitalized: util.inflection.capitalize(name),

    namePlural: namePlural,
    namePluralCapitalized: util.inflection.capitalize(namePlural),
  }

  vfs.copyTpl(
    util.projectFile(`generators/model/model-template.ejs`),
    util.projectFile(`server/models/${ name }.js`),
    templateVars
  )
}
