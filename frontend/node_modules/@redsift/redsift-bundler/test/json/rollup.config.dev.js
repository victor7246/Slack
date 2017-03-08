const path = require('path');
const config = require('../../config/rollup/dev');
const files = require('../files');

config.entry = files.json.inputFile;
config.dest = files.json.rollupCLI.created.outputFileDev;

module.exports = config;
