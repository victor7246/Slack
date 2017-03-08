/**
 * Main scripts for the Sift to be bundled
 */
'use strict';

const files = require('../files');

var mainJS = [
  {
    name: 'html-import',
    indexFile: './input.js'
  }
];

/**
 * Main styles for the Sift to be bundled
 */
 var styles = [];

/**
 * Default configurations
 */
var defaults = {
  formats: ['umd'],
  outputFolder: files.htmlImport.webpackGulp.created.outputFolder,
  mapsDest: '.',
  externalMappings: {},
  useNormalizeCSS: false
};

function bundles(type) {
  var l, v, r =[];
  switch(type) {
    case 'css':
      l = styles;
      v = 'styles';
      break;
    case 'js':
      l = mainJS;
      v = 'mainJS';
      break;
    default:
      console.error('Unsupported bundle type: ', type);
      return;
  }
  l.forEach(function (o) {
    var oo = {};
    oo[v] = o;
    r.push(Object.assign(oo, defaults));
  });
  return r;
}

module.exports = bundles;
