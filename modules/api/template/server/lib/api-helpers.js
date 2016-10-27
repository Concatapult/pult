

var API = module.exports

API.prep = function (statusCode, response) {
  return function (input) {
    response.status( statusCode )

    if ( input instanceof Error ) {
      // Custom errors should implement .toResponseBody()
      response.send( input.toResponseBody ? input.toResponseBody() : { message: input.message } )
    }
    else {
      response.send( input )
    }
  }
}

API.catchUnexpectedErrors = function (res) {
  return function (err) {
    var resBody = { type: 'unexpected_error', message: err.message }

    if ( process.env.NODE_ENV !== 'production' ) {
      resBody.stack = err.stack
    }
    res.status(500).send( resBody )
  }
}
