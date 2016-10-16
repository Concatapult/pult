#!/usr/bin/env node
var co = require('co')
var prompt = require('co-prompt')
var Promise = require('bluebird')

var exec = require('./lib/exec')

var Path = require('path')
var program = require('commander')

program
  .version('0.1.0')

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

    // TODO: Error handling
    var package = require( Path.resolve(process.cwd(), 'package.json'))

    var config = {
      package: package,
      projectRoot: process.cwd(),
    }

    var result = require('./commands/add-module.js')(vfs, config, module, moduleArgs)

    console.log(`\nAdding the ${module} module will result in the following changes:\n`)
    var base = null
    store.each(function (file) {
      if ( ! file.state ) return;
      base = base || util.getCommonPath(config.projectRoot, file.history[0])
      console.log(`  ${ file.isNew ? '+' : 'M' } ${ file.history[0].replace(base, '.') }`)
    })

    if ( result.installs ) {
      console.log('\nand install the following packages:\n')
      console.log(`    ${ result.installs.join(', ') }`)
    }


    co(function * () {
      var response = yield prompt('\nIs this ok? (Y/n) ')

      if ( response && response.toLowerCase() !== 'y' ) {
        console.log("Cancelled.")
        return process.exit(0)
      }

      yield call(vfs, 'commit')

      if ( result.installs ) { yield exec('yarn') }

      console.log(`Added ${module}! :)`)
    })
      .then(exit(0), exit(1))
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
      yield exec(`git`, ['init'])
      yield exec(`git`, ['add', '.'])
      yield exec(`git`, ['commit', '-m', `"First commit"`])

      console.log("\nYour new project is ready! `cd` into it to get started:\n")
      console.log(`    $ cd ${projectName}`)
      console.log(`    $ yarn`)
      console.log(`    $ npm start\n`)
      console.log(`    $ pult add knex pg # optional; see docs for more modules\n`)
    })
      .then(exit(0), exit(1))
  })


//
// Utility
//
var call = (obj, method, ...args) => Promise.promisify(obj[method]).apply(obj, args)

var exit = (code) => (x) => {
  if ( x instanceof Error ) console.error(x)
  process.exit(code)
}

//
// Begin the process
//
program.parse(process.argv)
