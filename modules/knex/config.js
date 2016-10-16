

module.exports = function configKnex (vfs, baseConfig, moduleArgs) {
  if ( moduleArgs.length >= 2 ) {
    throw new Error('Module `knex` only takes 1 argument')
  }

  var dialect = dialectMap[ moduleArgs[0] ]
  if ( ! dialect ) {
    let options = Object.keys(driverMap).sort()
    throw new Error('Module `knex` needs a dialect. Options are:\n  ' + options.join(', '))
  }

  var config = {

    client: driverMap[dialect],

    dependencies: {
      knex: '^0.12.5',
      [driverMap[dialect]]: '*',
    }
  }

  config.installs = Object.keys(config.dependencies)

  return config
}

// Taken from https://github.com/tgriesser/knex/tree/3609de76b34cb9ed6171505f3b614c0526c0e9ca/src/dialects
var dialectMap = {
  'maria':          'maria',
  'mariadb':        'maria',
  'mariasql':       'maria',
  'mssql':          'mssql',
  'mysql':          'mysql',
  'mysql2':         'mysql2',
  'oracle':         'oracle',
  'oracledb':       'oracledb',
  'pg':             'postgres',
  'postgres':       'postgres',
  'sqlite':         'sqlite3',
  'sqlite3':        'sqlite3',
  'strong-oracle':  'strong-oracle',
  'websql':         'websql',
}

var driverMap = {
  'maria':          'mariasql',
  'mssql':          'mssql',
  'mysql':          'mysql',
  'mysql2':         'mysql2',
  'oracle':         'oracle',
  'oracledb':       'oracledb',
  'postgres':       'pg',
  'sqlite3':        'sqlite3',
  'websql':         'websql',
  'strong-oracle':  'strong-oracle',
}
