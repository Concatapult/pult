var fs = require('fs')


module.exports = function installPreCommitHook () {
  var contents = fs.readFileSync(__dirname + '/pre-commit')
  fs.writeFileSync('.git/hooks/pre-commit', contents)
  fs.chmodSync('.git/hooks/pre-commit', '755')
}
