const path = require('path');
const config = require('../../config/rollup/prod');
const files = require('../files');

config.entry = files.json.inputFile;
config.dest = files.json.rollupCLI.created.outputFile;

module.exports = config;
