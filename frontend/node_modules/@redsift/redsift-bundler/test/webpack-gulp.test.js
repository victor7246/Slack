const test = require('@redsift/tape-reel')(null, null, 'rollup-cli');
const shell = require('shelljs');
const path = require('path');
const utils = require('./lib/utils');
const files = require('./files');

test('setup webpack-gulp test', function(t) {
  shell.exec(`rm -rf ${files.tmpFolder}`);
  t.end();
});

test('builds a minified UMD bundle from an ES6 input file', function(t) {
  const workingDir = path.join('test', 'es6');
  const gulpfile = path.join(workingDir, 'gulpfile.js');
  const configFile = 'bundle.config.js' // NOTE: relative to workingDir

  const configFileExists = utils.doesFileExist(path.join(workingDir, configFile));
  t.ok(configFileExists, 'config file exists');

  const exec = './node_modules/.bin/gulp --gulpfile ' + gulpfile + ' -c ' + configFile + ' -w ' + workingDir;
  shell.exec(exec);

  const outputFileExists = utils.doesFileExist(files.es6.webpackGulp.created.outputFile);
  t.ok(outputFileExists, 'gulptask created output file');

  const doFilesMatch = utils.compareFiles(files.es6.webpackGulp.created.outputFile, files.es6.webpackGulp.reference.outputFile);
  t.ok(doFilesMatch, 'output file equals reference');

  t.end();
});

test('builds a minified UMD bundle from a React/JSX input file', function(t) {
  const workingDir = path.join('test', 'react-jsx');
  const gulpfile = path.join(workingDir, 'gulpfile.js');
  const configFile = 'bundle.config.js' // NOTE: relative to workingDir

  const configFileExists = utils.doesFileExist(path.join(workingDir, configFile));
  t.ok(configFileExists, 'config file exists');

  const exec = './node_modules/.bin/gulp --gulpfile ' + gulpfile + ' -c ' + configFile + ' -w ' + workingDir;
  shell.exec(exec);

  const outputFileExists = utils.doesFileExist(files.reactJSX.webpackGulp.created.outputFile);
  t.ok(outputFileExists, 'gulptask created output file');

  const doFilesMatch = utils.compareFiles(files.reactJSX.webpackGulp.created.outputFile, files.reactJSX.webpackGulp.reference.outputFile);
  t.ok(doFilesMatch, 'output file equals reference');

  t.end();
});

test('imports JSON files', function(t) {
  const workingDir = path.join('test', 'json');
  const gulpfile = path.join(workingDir, 'gulpfile.js');
  const configFile = 'bundle.config.js' // NOTE: relative to workingDir

  const configFileExists = utils.doesFileExist(path.join(workingDir, configFile));
  t.ok(configFileExists, 'config file exists');

  const exec = './node_modules/.bin/gulp --gulpfile ' + gulpfile + ' -c ' + configFile + ' -w ' + workingDir;
  shell.exec(exec);

  const outputFileExists = utils.doesFileExist(files.json.webpackGulp.created.outputFile);
  t.ok(outputFileExists, 'gulptask created output file');

  const doFilesMatch = utils.compareFiles(files.json.webpackGulp.created.outputFile, files.json.webpackGulp.reference.outputFile);
  t.ok(doFilesMatch, 'output file equals reference');

  t.end();
});

test('imports HTML template files', function(t) {
  const workingDir = path.join('test', 'html-import');
  const gulpfile = path.join(workingDir, 'gulpfile.js');
  const configFile = 'bundle.config.js' // NOTE: relative to workingDir

  const configFileExists = utils.doesFileExist(path.join(workingDir, configFile));
  t.ok(configFileExists, 'config file exists');

  const exec = './node_modules/.bin/gulp --gulpfile ' + gulpfile + ' -c ' + configFile + ' -w ' + workingDir;
  shell.exec(exec);

  const outputFileExists = utils.doesFileExist(files.htmlImport.webpackGulp.created.outputFile);
  t.ok(outputFileExists, 'gulptask created output file');

  const doFilesMatch = utils.compareFiles(files.htmlImport.webpackGulp.created.outputFile, files.htmlImport.webpackGulp.reference.outputFile);
  t.ok(doFilesMatch, 'output file equals reference');

  t.end();
});

test('teardown', function(t) {
  shell.exec(`rm -rf ${files.tmpFolder}`);
  t.end();
});
