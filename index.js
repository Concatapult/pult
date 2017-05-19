#!/usr/bin/env node
var co = require('co')
var prompt = require('co-prompt')
var Promise = require('bluebird')

var errors = require('./lib/errors')
var exec = require('./lib/exec')
var colors = require('./lib/colors')

var fs   = require('fs')
var Path = require('path')
var program = require('commander')

program
  .version('0.4.2')

//
// The in-memory file system
//
var memFs = require('mem-fs')
var editor = require('mem-fs-editor')

var store = memFs.create()
var vfs = editor.create(store)

var util = require('mem-fs-editor/lib/util')

//
// Add a new module
//
program
  .command('add <module> [moduleArgs...]')
  .action(function (module, moduleArgs) {
    module = module.toLowerCase()
    // Wrap everything in co to easily catch errors
    co(function * () {

      try {
        fs.accessSync( Path.resolve(__dirname,`modules/${module}/config.js` ) )
      }
      catch (e) {
        throw new errors.NonexistentModule(module)
      }

      var config = {
        package: require( Path.resolve(process.cwd(), 'package.json')),
        projectRoot: process.cwd(),
        server: require( Path.resolve(process.cwd(), 'server/config/index.json')),
        serverSetup: require( Path.resolve(process.cwd(), 'server/config/setup/index.json')),
      }

      var result = require('./commands/add-module.js')(vfs, config, module, moduleArgs)

      console.log(`\nAdding the ${ colors.subject(module) } module will result in the following changes:\n`)
      var base = null
      store.each(function (file) {
        if ( ! file.state ) return;
        base = base || util.getCommonPath(config.projectRoot, file.history[0])

        var shortFilePath = file.history[0].replace(base, '.')
        file.isNew
          ? console.log(colors.fileAdd(`  + ${ shortFilePath }`))
          : console.log(colors.fileMod(`  M ${ shortFilePath }`))
      })

      if ( result.installs ) {
        console.log('\nand install the following packages:\n')
        console.log(`    ${ result.installs.join(', ') }`)
      }

      if ( result.serverSetup ) {
        console.log(`\nIt will also re-run ${ colors.command('yarn setup') }.`)
      }


      var response = yield prompt('\nIs this ok? (Y/n) ')

      if ( response && response.toLowerCase() !== 'y' ) {
        console.log("Cancelled.")
        return process.exit(0)
      }

      yield call(vfs, 'commit')

      if ( result.installs ) { yield exec('yarn') }
      if ( result.serverSetup ) { yield exec('yarn setup') }

      console.log(`Added ${module}! :)`)
    })
      .then(exit(0), exit(1))
  })

//
// List all modules
//
program
  .command('modules')
  .alias('ls')
  .action(function () {
    var modules = fs.readdirSync( Path.resolve( __dirname, './modules' ) )
    var list = require('./commands/list-modules.js')(modules)
    console.log(list)
  })

//
// Generate a new project
//
program
  .command('new <projectName>')
  .action(function (projectName) {

    var config = {
      projectName: projectName,
      cwd: process.cwd(),
    }

    var result = require('./commands/new-project.js')(vfs, config, projectName)

    co(function * () {
      yield call(vfs, 'commit')

      // "cd" into newly generated project folder
      process.chdir('./' + projectName)

      // Initialize some things
      yield exec(`yarn`)
      yield exec(`git`, ['init'])
      yield exec(`git`, ['add', '.'])
      yield exec(`git`, ['commit', '-m', `"First commit"`])
      yield exec(`yarn`, ['setup'])

      console.log("\nYour new project is ready! `cd` into it to get started:\n")
      console.log(`    $ cd ${projectName}`)
      console.log(`    $ yarn watch`)
      console.log(`    $ pult add knex pg  # optional; see docs for more modules\n`)
    })
      .then(exit(0), exit(1))
  })

//
// Generators
//
program
  .command('generate <generatorName> [generatorArgs...]')
  .alias('g')
  .action(function (generatorName, generatorArgs) {
    generatorName = generatorName.toLowerCase()

    var config = {
      projectRoot: process.cwd(),
    }

    co(function * () {

      var result = yield require(`./commands/run-generator`)(vfs, config, generatorName, generatorArgs)

      console.log(`\nGenerating this ${generatorName} will result in the following changes:\n`)
      var base = null
      store.each(function (file) {
        if ( ! file.state ) return;
        base = base || util.getCommonPath(config.projectRoot, file.history[0])
        console.log(`  ${ file.isNew ? '+' : 'M' } ${ file.history[0].replace(base, '.') }`)
      })

      var response = yield prompt('\nIs this ok? (Y/n) ')

      if ( response && response.toLowerCase() !== 'y' ) {
        console.log("Cancelled.")
        return process.exit(0)
      }

      yield call(vfs, 'commit')
      console.log(`Generated ${generatorName}! :)`)
    })
      .then(exit(0), exit(1))
  })

//
// Catch-all (invalid arguments)
//
program
  .command('*')
  .action(function(){
    exec(`pult --help`)
  });

//
// No arguments
//
if(process.argv.length === 2) {
  exec(`pult --help`)
}

//
// Utility
//
var call = (obj, method, ...args) => Promise.promisify(obj[method]).apply(obj, args)

var exit = (code) => (x) => {
  if ( x instanceof errors.PultError ) {
    console.error(colors.error("\nError:"), x.message, '\n')
  }
  else if ( x instanceof Error ) {
    console.error(x)
  }
  process.exit(code)
}

//
// Begin the process
//
program.parse(process.argv)
