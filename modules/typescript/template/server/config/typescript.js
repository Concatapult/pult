
exports.mount = function mountTypeScript (router) {

  if ( process.env.NODE_ENV === 'test' ) return;

  require('ts-node').register({
    cache: true,
    cacheDirectory: '.cache/ts',
    fast: process.env.NODE_ENV === 'production',
    lazy: true,
  })
}
