var Path = require('path')
var semver = require('semver')
var semverIntersect = require('semver-set').intersect

var colors = require('../lib/colors')
var errors = require('../lib/errors')

module.exports = function getListContent(modules) {

  var package = require( Path.resolve( process.cwd(), 'package.json' ) )
  package.addedPultModules = package.addedPultModules || [];
  var destValMap = {}

  var depTree = modules.map((moduleName) => {
    // Retrieve this file's config.
    var config = require( Path.resolve( __dirname, `../modules/${moduleName}/config` ) );

    // Set color for items that are still possible to use
    var textColor = colors.fileMod

    // Set color for items that are already in use
    if ( package.addedPultModules.includes(moduleName) ) {
      textColor = colors.fileAdd
    }

    // Set color for items that can't be used due to a conflict
    if ( config.pultModuleConflicts.some( con => package.addedPultModules.includes(con) ) ) {
      textColor = colors.error
    }

    // Set color for items that can't be used because there is a missing dependency
    if ( ! config.pultModuleDeps.every( dep => package.addedPultModules.includes(dep) ) ) {
      textColor = colors.error
    }

    // Build basic node
    var node = {
      name: moduleName,
      children: [],
      color: textColor
    }

    // If the node isn't top level, associate it with parent name in object.
    for (var dep of config.pultModuleDeps) {
      destValMap[dep] = destValMap[dep] || []
      destValMap[dep].push(node)
      return null
    }

    // Otherwise add it to top level
    return node
  })

  // Recursively insert dependencies into the parent's children.
  function reconcile(children) {
    if ( children.length === 0  || Object.keys(destValMap).length === 0 ) return children;
    return children
      .filter(node => Boolean(node))
      .map(node => {
        if ( destValMap[node.name] ) {
          node.children = node.children.concat(destValMap[node.name])
          delete destValMap[node.name]
        }
        node.children = reconcile(node.children)
        return node;
      })
  }

  // Recursively print out colored and indented text for each module
  function print(children, indent = '      ', text = '') {
    if ( children.length === 0 ) return ''
    for (var child of children) {
      text += indent
        + child.color(child.name)
        + '\n'
        + print(child.children, `${indent}  `, '')
    }
    return text
  }

  return `
    List of all pult modules:
${print(reconcile(depTree))}

    To add a pult module:
      $ pult add <module>
`;
}
