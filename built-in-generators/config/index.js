var Path = require('path')

var usageDocs = (name) => `
\`pult g config ${name}\` requires one more argument - what position you want to run your config.

    $ pult add api ${name} start
    $ pult add api ${name} end

will add to the beginning or end of your routerPipeline. Your options are:

    beginning (aliases: start, first, pre, prepend)
    end       (aliases: last, append, post)
    none
`


module.exports = function * generateApi (util, vfs, config, name, position) {

  if ( ! name ) {
    name = ( yield util.prompt('Name of config file (websockets, sessions, etc.): ') )
          || util.fail('`pult generate config` requires a name.')
  }

  name = name.replace(/-/g, '_') // inflection only supports working with underscores

  var fileName = util.inflection.dasherize(name).toLowerCase()
  var functionName = 'mount' + util.inflection.classify(name)

  if ( ! position ) {
    console.log( usageDocs(name) )
    position = yield util.prompt(
      'Enter where you want your config to run\n[default is beginning]: ')
  }

  position = positionMap[position]

  if ( ! position ) {
    util.fail('`pult generate config` needs a valid position.')
  }


  var templateVars = {
    functionName: functionName,
  }

  vfs.copyTpl(
    Path.resolve(__dirname, 'template.ejs'),
    util.projectFile(`server/config/${ fileName }.js`),
    templateVars
  )

  //
  // Add config file to routerPipeline
  //
  if ( position !== 'none' ) {
    var configJsonPath = util.projectFile('server/config/index.json')
    var configJson     = JSON.parse( vfs.read(configJsonPath) )

    if ( position === 'beginning' ) {
      configJson.routerPipeline.unshift(`./${fileName}.js`)
    }
    else if ( position === 'end' ) {
      configJson.routerPipeline.push(`./${fileName}.js`)
    }

    vfs.write(configJsonPath, JSON.stringify(configJson, null, '  ') + '\n')
  }
}


var positionMap = {
  beginning: 'beginning',
  start: 'beginning',
  first: 'beginning',
  pre: 'beginning',
  prepend: 'beginning',

  end: 'end',
  last: 'end',
  append: 'end',
  post: 'end',

  none: 'none',
}
