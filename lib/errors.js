var c = require('./colors')

exports.PultError = class PultError extends Error {}

exports.ModuleError = class ModuleError extends exports.PultError {}

exports.MissingDependency = class MissingDependency extends exports.PultError {
  constructor(dep) {
    super(`Missing dependency ${ c.subject(dep) }. Try adding it first:\n\n    $ pult add ${dep}`)
  }
}

exports.IncompatibleModule = class IncompatibleDependency extends exports.PultError {
  constructor(dep, conflict) {
    super(`Module ${ c.subject(dep) } is incompatible with the module ${c.subject(conflict)}`)
  }
}

exports.TooManyArguments = class TooManyArguments extends exports.PultError {
  constructor(name, max) {
    // 0 argumentS, 1 argument, 2 argumentS (English is the worst)
    var argumentPlurality = max === 1 ? '' : 's'
    super(`Module ${ c.subject(name) } only allows ${ c.error(max) } argument${argumentPlurality}`)
  }
}

exports.NonexistentModule = class NonexistentDependency extends exports.PultError {
  constructor(name) {
    super(`Module '${c.subject(name)}' does not exist.`)
  }
}
