const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');

const config = require('./base');

// Inject the production settings:
config.moduleName = 'TestBundle';
config.plugins[3] = replace({ 'process.env.NODE_ENV': JSON.stringify('production') });
config.plugins.push(uglify());

module.exports = config;
