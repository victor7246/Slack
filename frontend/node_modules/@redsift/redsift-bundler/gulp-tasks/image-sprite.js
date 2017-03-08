var sprity = require('sprity'),
  // gulpif = require('gulp-if'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  path = require('path'),
  _ = require('lodash');

module.exports = function setupTask(gulp, bundles) {
  var configProp = 'imageSprite';

  // NOTE: To not execute this task each time the gulpfile defines a task with
  // gulp.task('task-name', ...) we return a function here, which gets called
  // eventually when calling a task via gulp.
  // NOTE: This setup function should take care of transforming src and dest
  // paths correctly!
  function task() {
    for (var idx = 0; idx < bundles.length; idx++) {
      var config = bundles[idx][configProp];
      var cssBase = path.dirname(config.destCSS),
        cssFileName = path.basename(config.destCSS),
        src = path.isAbsolute(config.src) ? config.src : path.join(bundles.workingDir, config.src),
        destCSS = path.isAbsolute(config.destCSS) ? config.destCSS : path.join(bundles.workingDir, cssBase) + '/' + cssFileName,
        destSprite = path.isAbsolute(config.destSprite) ? config.destSprite : path.join(bundles.workingDir, config.destSprite);

      console.log('destCSS: ' + destCSS);
      return createImageSprite(gulp, src, destSprite, destCSS, config.options);
    }
  }
  return task;
}

function createImageSprite(gulp, src, destSprite, destCSS, options) {
  var sprityConfig = options;
  sprityConfig.src = src;
  sprityConfig.style = destCSS;
  sprityConfig.out = destSprite;

  return sprity.src(sprityConfig)
    // .pipe(gulpif('*.png', gulp.dest('./dist/img/'), gulp.dest('./dist/css/')))
    .pipe(gulp.dest(destCSS));
}
