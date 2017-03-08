const path = require('path');
const config = require('../../config/rollup/dev');
const files = require('../files');

config.entry = files.es6.inputFile;
config.dest = files.es6.rollupCLI.created.outputFileDev;

module.exports = config;
