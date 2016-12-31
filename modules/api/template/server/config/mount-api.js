var apiRouter = require('../apis')


var apiPrefix = '/'

exports.mount = function (router) {
  router.use(apiPrefix, apiRouter)
}
