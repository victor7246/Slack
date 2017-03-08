const path = require('path');
const config = require('../../config/rollup/dev');
const files = require('../files');

config.entry = files.reactJSX.inputFile;
config.dest = files.reactJSX.rollupCLI.created.outputFileDev;

module.exports = config;
