const test = require('@redsift/tape-reel')(null, null, 'rollup-cli');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const utils = require('./lib/utils');

const rollupBin = './node_modules/.bin/rollup';
const files = require('./files');

test('setup rollup-cli test', function(t) {
  execSync(`rm -rf ${files.tmpFolder}`);
  t.end();
});

test('builds a minified UMD bundle from an ES6 input file', function(t) {
  const rollupConfigFileExists = utils.doesFileExist(files.es6.rollupCLI.config.prod);
  t.ok(rollupConfigFileExists, 'config file exists');

  const code = execSync(`${rollupBin} -c ${files.es6.rollupCLI.config.prod}`);

  const outputFileExists = utils.doesFileExist(files.es6.rollupCLI.created.outputFile);
  t.ok(outputFileExists, 'rollup-cli created output file');

  const doFilesMatch = utils.compareFiles(files.es6.rollupCLI.created.outputFile, files.es6.rollupCLI.reference.outputFile);
  t.ok(doFilesMatch, 'output file equals reference');

  t.end();
});

test('builds an un-minified UMD bundle from an ES6 input file', function(t) {
  const rollupConfigFileExists = utils.doesFileExist(files.es6.rollupCLI.config.dev);
  t.ok(rollupConfigFileExists, 'config file exists');

  const code = execSync(`${rollupBin} -c ${files.es6.rollupCLI.config.dev}`);

  const outputFileExists = utils.doesFileExist(files.es6.rollupCLI.created.outputFileDev);
  t.ok(outputFileExists, 'rollup-cli created output file');

  const doFilesMatch = utils.compareFiles(files.es6.rollupCLI.created.outputFileDev, files.es6.rollupCLI.reference.outputFileDev);
  t.ok(doFilesMatch, 'output file equals reference');

  t.end();
});

test('builds a minified UMD bundle from a React/JSX input file', function(t) {
  const rollupConfigFileExists = utils.doesFileExist(files.reactJSX.rollupCLI.config.prod);
  t.ok(rollupConfigFileExists, 'config file exists');

  const code = execSync(`${rollupBin} -c ${files.reactJSX.rollupCLI.config.prod}`);

  const outputFileExists = utils.doesFileExist(files.reactJSX.rollupCLI.created.outputFile);
  t.ok(outputFileExists, 'rollup-cli created output file');

  const doFilesMatch = utils.compareFiles(files.reactJSX.rollupCLI.created.outputFile, files.reactJSX.rollupCLI.reference.outputFile);
  t.ok(doFilesMatch, 'output file equals reference');

  t.end();
});

test('builds a un-minified UMD bundle from a React/JSX input file', function(t) {
  const rollupConfigFileExists = utils.doesFileExist(files.reactJSX.rollupCLI.config.dev);
  t.ok(rollupConfigFileExists, 'config file exists');

  const code = execSync(`${rollupBin} -c ${files.reactJSX.rollupCLI.config.dev}`);

  const outputFileExists = utils.doesFileExist(files.reactJSX.rollupCLI.created.outputFileDev);
  t.ok(outputFileExists, 'rollup-cli created output file');

  const doFilesMatch = utils.compareFiles(files.reactJSX.rollupCLI.created.outputFileDev, files.reactJSX.rollupCLI.reference.outputFileDev);
  t.ok(doFilesMatch, 'output file equals reference');

  t.end();
});

test('imports JSON files', function(t) {
  const rollupConfigFileExists = utils.doesFileExist(files.json.rollupCLI.config.prod);
  t.ok(rollupConfigFileExists, 'config file exists');

  const code = execSync(`${rollupBin} -c ${files.json.rollupCLI.config.prod}`);

  const outputFileExists = utils.doesFileExist(files.json.rollupCLI.created.outputFile);
  t.ok(outputFileExists, 'rollup-cli created output file');

  const doFilesMatch = utils.compareFiles(files.json.rollupCLI.created.outputFile, files.json.rollupCLI.reference.outputFile);
  t.ok(doFilesMatch, 'output file equals reference');

  t.end();
});

// test('teardown', function(t) {
//   execSync(`rm -rf ${files.tmpFolder}`);
//   t.end();
// });
