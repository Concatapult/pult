var db = require('./knex-driver')
var Promise = require('bluebird')

exports.create = function (modelName, options={}) {
  var Model, methods;

  var tableName = options.tableName || null
  var idColumn  = options.idColumn  || 'id'

  if ( ! tableName ) {
    throw new Error('[knex-model.js] You must specify a tableName')
  }
  //
  // Initialize with methods common across all models
  //
  methods = {

    all: function () {
      return db(tableName).select('*')
    },

    // Finds a single record by id
    find: function (id) {
      return Model.findBy({ [idColumn]: id })
    },

    // Finds a single record
    findBy: function (attrs) {
      return db(tableName).select('*').where(attrs).limit(1)
        .then(function(rows) {
          return (rows.length === 0) ? Promise.reject(new Model.NotFound) : rows[0]
        })
    },

    save: function (attrs) {
      return attrs[idColumn] ? Model.updateOne(attrs) : Model.create(attrs)
    },

    create: function (attrs) {
      attrs.created_at = new Date()
      return db(tableName).insert(attrs).returning(idColumn)
        .then(function (rows) {
          return Object.assign({ [idColumn]: rows[0] }, attrs)
        })
    },

    // Updates a specific record by its id
    updateOne: function (attrs) {
      if (! attrs[idColumn]) {
        return Promise.reject(new Model.InvalidArgument(`${idColumn}_is_required`))
      }

      attrs.updated_at = new Date()
      return db(tableName).update(attrs).where({ [idColumn]: attrs[idColumn] })
        .then(function(affectedCount) {
          return (affectedCount === 0) ? Promise.reject(new Model.NotFound) : attrs
        })
    },

    delete: function (id) {
      return db(tableName).where({ [idColumn]: id }).delete()
    }
  }

  //
  // Construct an object with methods as its prototype to make overriding easier
  //
  Model = Object.create(methods)
  Model.methods = methods

  //
  // Custom Errors (useful for handling via Promise#catch)
  //
  Model.NotFound = class NotFound extends Error {
    constructor() {
      super(`${modelName}: not found.`)
      this.type = `not_found`
      this.meta = { model: modelName }
    }
  }

  Model.InvalidArgument = class InvalidArgument extends Error {
    constructor(message) {
      super(`${modelName}: ${message}`)
      this.type = `invalid_argument`
      this.meta = { model: modelName }
    }
  }

  return Model
}
