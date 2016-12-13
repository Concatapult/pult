/* * * * * * * * * * * * * * * * * * * * * * * * *
  This file is run on the `npm run setup` command.
  It is intended to handle everything necessary in getting a
  freshly cloned project set up (after running `yarn` of course).

  Instructions for adding a setup file:

   1. Create a .js file in server/config/setup/
      Example: my-setup.js
   2. Add the file to the `steps` array within `index.json` as a string.
      Example: "./my-setup.js"
   3. In your terminal, run `npm run setup`.
      The code in this file ensures that a setup file
      is only run once per local dev machine.

* * * * * * * * * * * * * * * * * * * * * * * * */

var fs = require('fs')
var Path = require('path')
var steps = require('./index.json').steps

var projectFile = (path) => Path.resolve(__dirname, '../../..', path)


//
// Only run each setup file once for the sake of being idempotent
//
var envPath = projectFile('.env')
var completed = []

if ( ! fs.existsSync(envPath) ) {
  let content = fs.readFileSync(projectFile('.env-example'), 'utf8')
  fs.writeFileSync(projectFile('.env'), content)
  fs.appendFileSync(projectFile('.env'), '__pult_setup__=\n')

}
else {
  var val = fs.readFileSync(envPath, 'utf8').match(/__pult_setup__=(.*)/)[1]
  completed = val && val.split(';') || []
}


var Bluebird = require('bluebird')

//
// Some config may be async;
// wrap in a coroutine for convenience.
//
Bluebird.coroutine(function * () {

  for (let item of steps) {
    if ( completed.includes(item) ) {
      console.log(item, "- already run; skipping.")
      continue;
    }

    console.log(item, "- running...")

    //
    // Wrap in promise to allow for both sync and async setup
    //
    yield Promise.resolve().then(function () {
      return require(item)({ projectFile: projectFile })
    })

    completed.push(item)

    //
    // Write to file now in case an error happens
    //
    let env = fs.readFileSync(envPath, 'utf8')
    fs.writeFileSync(
      envPath,
      env.replace(/__pult_setup__=(.*)/, `__pult_setup__=${ completed.join(';') }`)
    )
    console.log(item, "- done.")
  }

  console.log("\n  All set up.\n")

})() // Immediately invoke coroutine
