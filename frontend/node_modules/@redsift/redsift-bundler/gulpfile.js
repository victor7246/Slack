'use strict';

var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  del = require('del'),
  path = require('path'),
  argv = require('yargs')
    .usage('Usage: $0 -c [config-file]')
    .demand(['c'])
    .describe('c', 'Bundle configuration file')
    .describe('w', 'Bundle working directory (i.e. paths in bundle config file are relative to this)')
    .argv;

  // var pkg = require('package.json');
  // console.log('R> redsift-bundler v' + pkg.version);

var bundleConfigPath = null,
  opts = {};
if (argv.w && argv.c) {
  bundleConfigPath = path.join(argv.w, argv.c);
  console.log('R> Loading bundle config from: ' + bundleConfigPath);

  var bundleConfig = require(bundleConfigPath);

  opts['workingDir'] = argv.w;
}

function getTask(task) {
  return require(path.join(__dirname, './gulp-tasks/' + task))(gulp, bundleConfig, opts);
}

gulp.task('bundle-js', getTask('bundle-js'));

gulp.task('bundle-css', getTask('bundle-css'));

gulp.task('css-watch', ['bundle-css'], function () {
  browserSync.reload('*.css');
});

gulp.task('js-watch', ['bundle-js'], function () {
  browserSync.reload('*.js');
});

gulp.task('serve', ['default', 'browser-sync'], function () {
  // gulp.watch(['./components/**/*.{import.styl,styl,css}', './bundles/**/*.{import.styl,styl,css}'], ['css-watch']);
  // gulp.watch(['./components/**/*.{js,tmpl}', './bundles/**/*.{js,tmpl}'], ['js-watch']);
  gulp.watch(path.join(bundleConfig.workingDir, '/samples/**/*.html')).on('change', function () {
    browserSync.reload('*.html');
  });
});

gulp.task('build', ['bundle-js', 'bundle-css']);

gulp.task('clean', function () {
  return del(['dist/**']);
});

gulp.task('default', ['build']);

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: [
        path.join(bundleConfig.workingDir, './samples'),
        path.join(bundleConfig.workingDir, './dist'),
        path.join(bundleConfig.workingDir, './assets')
      ],
      directory: true
    }
  });
});
