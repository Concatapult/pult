var session = require('cookie-session')


exports.mount = function mountCookieSession (router) {
  if ( process.env.NODE_ENV === 'production' && ! process.env.SESSION_SECRET ) {
    console.error("Please set SESSION_SECRET")
    process.exit(1)
  }

  router.use(session({
    name: 'my-app:session',
    secret: process.env.SESSION_SECRET || 'development',
    secure: (!! process.env.SESSION_SECRET),
    signed: true,
  }))

  //
  // WARNING:
  // If you are planning to push this code to heroku,
  // you may have to add this line to server/index.js
  // to allow your app to set cookies for your session:
  //
  //    app.set('trust proxy', 1) // trust first proxy
  //
}
