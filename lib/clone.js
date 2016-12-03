//
// Simple clone that only considers Objects and Arrays
//
module.exports = function clone (item) {
  if ( Array.isArray(item) ) {
    return item.slice().map(clone)
  }
  else if ( isObject(item) ) {
    var cloned = {}
    for (var prop in item) {
      cloned[prop] = clone( item[prop] )
    }
    return cloned
  }
  else {
    return item
  }
}

var isObject = (item) => Object.prototype.toString.call(item)
