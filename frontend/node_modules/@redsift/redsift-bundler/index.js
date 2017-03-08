var path = require('path');

function loadTask(gulp, taskFileName, bundleConfig) {
  var opts = {
    workingDir: '.'
  }
  return require(path.join(__dirname, './gulp-tasks', taskFileName))(gulp, bundleConfig, opts);
}

function printBundleSummary(bundleConfig) {
  for (var idx = 0; idx < bundleConfig.length; idx++) {
    var bundle = bundleConfig[idx];
    if (bundle.mainJS) {
      for (var idx1 = 0; idx1 < bundle.formats.length; idx1++) {
        var postFix = null,
          format = bundle.formats[idx1];
        if (format === 'es') {
          postFix = '.es2015';
        }
        else if (format === 'umd') {
          postFix = '.umd-es2015';
        }
        else if (format === 'cjs') {
          postFix = '.cjs-es2015';
        }
        console.log('   [JS] ' + bundle.mainJS.indexFile + ' -> ' + path.join(bundle.outputFolder, 'js', bundle.mainJS.name + postFix + '.js'));
        console.log('   [JS] ' + bundle.mainJS.indexFile + ' -> ' + path.join(bundle.outputFolder, 'js', bundle.mainJS.name + postFix + '.min.js'));
      }
    }
    if (bundle.styles && bundle.styles.length) {
      console.log('\n');
      for (var idx0 = 0; idx0 < bundle.styles.length; idx0++) {
        var style = bundle.styles[idx0];
        console.log('  [CSS] ' + style.indexFile + ' -> ' + path.join(bundle.outputFolder, 'css', style.name + '.css'));
        console.log('  [CSS] ' + style.indexFile + ' -> ' + path.join(bundle.outputFolder, 'css', style.name + '.min.css'));
      }
      console.log('\n');
    }
  }
}

module.exports = {
  loadTask: loadTask,
  printBundleSummary: printBundleSummary
}
