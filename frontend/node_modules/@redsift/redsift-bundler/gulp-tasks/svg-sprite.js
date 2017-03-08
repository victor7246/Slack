var svgSprite = require('gulp-svg-sprite'),
  html2jsx = require('gulp-html2jsx'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  path = require('path'),
  _ = require('lodash');

module.exports = function setupTask(gulp, bundles) {
  function task() {
    for (var idx = 0; idx < bundles.length; idx++) {
      var svgSpriteConfig = bundles[idx].svgSprite,
        src = null,
        dest = null;

      if (!path.isAbsolute(svgSpriteConfig.src)) {
        src = path.join(bundles.workingDir, svgSpriteConfig.src);
      }
      else {
        src = svgSpriteConfig.src;
      }

      if (!path.isAbsolute(svgSpriteConfig.src)) {
        dest = path.join(bundles.workingDir, svgSpriteConfig.dest);
      }
      else {
        dest = svgSpriteConfig.dest;
      }

      var jsxConfig = null;
      if (bundles[idx].transform && bundles[idx].transform.jsx) {
        jsxConfig = bundles[idx].transform.jsx;

        if (!path.isAbsolute(jsxConfig.dest)) {
          jsxConfig.dest = path.join(bundles.workingDir, jsxConfig.dest);
        }
      }
      createSVGSprite(gulp, src, dest, svgSpriteConfig.config, jsxConfig);
    }
  }

  // NOTE: To not execute a task each time the gulpfile defines a task with
  // gulp.task('task-name', ...) we return a function here, which gets called
  // eventually when calling a task via gulp.
  return task;
}

function createSVGSprite(gulp, srcGlob, dest, svgSpriteConfig, jsxConfig) {
  var stream = gulp.src(srcGlob)
    .pipe(svgSprite(svgSpriteConfig))
    .pipe(gulp.dest(dest));

  // FIXXME: this is very specific at the moment. generalize!
  if (jsxConfig) {
    gulp.src(path.join(dest, 'symbol/svg/sprite.symbol.svg'))
      .pipe(html2jsx(jsxConfig.config))
      .pipe(replace('render: function() {', 'render() {'))
      .pipe(replace('{/*?xml version="1.0" encoding="utf-8"?*/}', ''))
      .pipe(replace(' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"', ''))
      .pipe(replace('<svg>', '<svg style={{display: "none"}}>'))
      .pipe(replace('var Icons = React.createClass({', 'export default class Icons extends React.Component {'))
      .pipe(replace('});', '}'))
      .pipe(rename('_icons.jsx'))
      .pipe(gulp.dest(jsxConfig.dest));
  }
  console.log('Wrote sprite files to %s', path.join(jsxConfig.dest));
}
