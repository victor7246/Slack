const path = require('path');
const config = require('../../config/rollup/prod');
const files = require('../files');

config.entry = files.es6.inputFile;
config.dest = files.es6.rollupCLI.created.outputFile;

module.exports = config;
