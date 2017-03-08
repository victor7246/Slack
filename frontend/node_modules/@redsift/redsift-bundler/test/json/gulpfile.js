'use strict';

var gulp = require('gulp');
var path = require('path');

// var  RSBundler = require('@redsift/redsift-bundler');
function loadTask(gulp, taskFileName, bundleConfig) {
  var opts = {
    workingDir: '.'
  }
  return require(path.join(__dirname, '..', '..', './gulp-tasks', taskFileName))(gulp, bundleConfig, opts);
}

// The definitions for this Sift's bundles
var bundles = require('./bundle.config.js');

gulp.task('bundle-js', loadTask(gulp, 'bundle-js', bundles('js')));
gulp.task('bundle-css', loadTask(gulp, 'bundle-css', bundles('css')));

gulp.task('default', ['bundle-js', 'bundle-css'], function() {
  console.log('Bundling complete');
});
