const replace = require('rollup-plugin-replace');
const config = require('./base');

// Inject the production settings:
config.moduleName = 'TestBundle';

module.exports = config;
