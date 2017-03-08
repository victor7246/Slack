#!/usr/bin/env node

var shell = require('shelljs'),
    path = require('path'),
    argv = require('yargs')
    .usage('Usage: $0 -c [config-file]')
    .demand(['c'])
    .describe('c', 'Bundle configuration file')
    .argv;

// console.log('Working dir: ' + process.cwd());

var gulpfile = path.join(__dirname, '..', 'gulpfile.js'),
    exec = 'gulp --gulpfile ' + gulpfile + ' -c ' + argv.c + ' -w ' + process.cwd() + ' serve';

console.log('exec: ' + exec);

shell.exec(exec);
