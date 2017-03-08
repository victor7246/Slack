const path = require('path');
const config = require('../../config/rollup/prod');
const files = require('../files');

config.entry = files.reactJSX.inputFile;
config.dest = files.reactJSX.rollupCLI.created.outputFile;

module.exports = config;
