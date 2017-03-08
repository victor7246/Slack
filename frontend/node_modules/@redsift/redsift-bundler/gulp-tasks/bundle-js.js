const rollup = require('rollup'),
  json = require('rollup-plugin-json'),
  uglify = require('rollup-plugin-uglify'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  includePaths = require('rollup-plugin-includepaths'),
  commonjs = require('rollup-plugin-commonjs'),
  path = require('path'),
  _ = require('lodash');

const rollupConfig = require('../config/rollup/prod');
const rollupDevConfig = require('../config/rollup/dev');

const webpack = require('webpack-stream');
const webpackConfig = require('../config/webpack/webpack.config.js');
const webpackConfigDev = require('../config/webpack/webpack.config.dev.js');

function _createWebpackBundle(gulp, config) {
  const entryFile = config.mainJS.indexFile;
  const destFile = path.join(config.mainJS.name + '.umd-es2015.min.js');
  const dest = path.join(config.outputFolder, 'js');

  if (!webpackConfig.output) {
    webpackConfig.output = {};
  }

  webpackConfig.output = Object.assign({}, webpackConfig.output, { filename: destFile });

  return gulp.src(entryFile)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(dest));
}

function _createWebpackBundleDev(gulp, config) {
  const entryFile = config.mainJS.indexFile;
  const destFile = path.join(config.mainJS.name + '.umd-es2015.js');
  const dest = path.join(config.outputFolder, 'js');

  if (!webpackConfigDev.output) {
    webpackConfigDev.output = {};
  }

  webpackConfigDev.output = Object.assign({}, webpackConfigDev.output, { filename: destFile });

  return gulp.src(entryFile)
    .pipe(webpack(webpackConfigDev))
    .pipe(gulp.dest(dest));
}

module.exports = function setupTask(gulp, bundles, bundlerOpts) {
  function task() {
    var tps = [];
    for (var idx = 0; idx < bundles.length; idx++) {
      var config = bundles[idx];
      for (var i = 0; i < config.formats.length; i++) {
        var format = config.formats[i],
          moduleName = config.moduleNameJS,
          dest = null,
          src = null;
        if (!path.isAbsolute(config.mainJS.indexFile)) {
          src = path.join(bundlerOpts.workingDir, config.mainJS.indexFile);
        }
        else {
          src = config.mainJS.indexFile;
        }
        if (format === 'es') {
          if (!path.isAbsolute(config.outputFolder)) {
            dest = path.join(bundlerOpts.workingDir, config.outputFolder, 'js', config.name || '', config.mainJS.name + '.es2015.js');
          }
          else {
            dest = path.join(config.outputFolder, 'js', config.name || '', config.mainJS.name + '.es2015.js');
          }
          tps.push(bundleES6(src, dest, config.externalMappings));
        }
        else {
          const useWebpack = true;
          if (useWebpack) {
            const webpackTask = _createWebpackBundle(gulp, config);
            tps.push(webpackTask);
            const webpackDevTask = _createWebpackBundleDev(gulp, config);
            tps.push(webpackDevTask);
          } else {
            if (!path.isAbsolute(config.outputFolder)) {
              dest = path.join(bundlerOpts.workingDir, config.outputFolder, 'js', config.name || '', config.mainJS.name + '.' + format + '-es2015.js');
            }
            else {
              dest = path.join(config.outputFolder, 'js', config.name || '', config.mainJS.name + '.' + format + '-es2015.js');
            }
            tps.push(transpileWithRollup(src, dest, format, moduleName, config.externalMappings));
          }
        }
      }
    }
    return Promise.all(tps);
  }
  // NOTE: To not execute a task each time the gulpfile defines a task with
  // gulp.task('task-name', ...) we return a function here, which gets called
  // eventually when calling a task via gulp.
  return task;
}

function bundleES6(indexFile, dest, externalMappings) {
  console.log('R> ES2015 bundling is disabled for now. You can import the entry file directly into your projects.');
  return;
  // console.log('[bundleES6] src: %s | dest: %s', indexFile, dest);

  // All external mappings have to be skipped by the nodeResolve plugin. Otherwise
  // the plugin would search for them in node_modules and complain if they are not found.
  var nodeResolveSkips = _.map(externalMappings, function (value, key) {
    return key;
  });

  // console.log('[bundle-js::bundleES6] index file:  ' + indexFile);
  // console.log('[bundle-js::bundleES6] dest folder: ' + dest);

  return rollup.rollup({
    entry: indexFile,
    external: [],
    plugins: [
      json(),
      // includePaths(includePathOptions),
      nodeResolve({
        jsnext: true,
        main: true,
        skip: nodeResolveSkips
      }),
      commonjs(),
      // filesize()
    ]
  }).then(function (bundle) {
    console.log('[bundle-js]: bundling: ', dest);
    return bundle.write({
      format: 'es',
      dest: dest
    });
  });
}

function transpileWithRollup(indexFile, dest, format, moduleName, externalMappings) {
  // console.log('[transpileWithRollup] src: %s | dest: %s', indexFile, dest);

  // All external mappings have to be skipped by the nodeResolve plugin. Otherwise
  // the plugin would search for them in node_modules and complain if they are not found.
  var nodeResolveSkips = _.map(externalMappings, function (value, key) {
    return key;
  });

  // console.log('[bundle-js::transpileWithRollup] index file:  ' + indexFile);
  // console.log('[bundle-js::transpileWithRollup] dest folder: ' + dest);

  var tps = [];

  rollupDevConfig.entry = indexFile;

  console.log('rollupDevConfig: ', rollupDevConfig);

  tps.push(rollup.rollup(rollupDevConfig
  //   {
  //   entry: indexFile,
  //   external: [],
  //   plugins: [
  //     json(),
  //     string({
  //       extensions: ['.tmpl']
  //     }),
  //     // includePaths(includePathOptions),
  //     nodeResolve({
  //       jsnext: true,
  //       main: true,
  //       skip: nodeResolveSkips
  //     }),
  //
  //     // CAUTION: make sure to initialize all file transforming additional plugins
  //     // BEFORE babel() or buble(). Otherwise the transpiler will consume the
  //     //imported files first.
  //     // babel(),
  //     buble(),
  //     commonjs(),
  //     // filesize()
  //   ]
  // }
).then(function (bundle) {
    // console.log('[bundle-js]: transpiling: ', dest);
    return bundle.write({
      format: format,
      moduleName: moduleName,
      globals: externalMappings,
      dest: dest,
      useStrict: false // NOTE: necessary for Safari when using web components. See https://github.com/ibm-js/delite/issues/259
    });
  }));

  console.log('rollupConfig: ', rollupConfig);

  tps.push(rollup.rollup(rollupConfig
  //   entry: indexFile,
  //   external: [],
  //   plugins: [
  //     json(),
  //     string({
  //       extensions: ['.tmpl']
  //     }),
  //     // includePaths(includePathOptions),
  //     nodeResolve({
  //       jsnext: true,
  //       main: true,
  //       skip: nodeResolveSkips
  //     }),
  //     // CAUTION: make sure to initialize all file transforming additional plugins
  //     // BEFORE babel() or buble(). Otherwise the transpiler will consume the
  //     //imported files first.
  //     // babel(),
  //     buble(),
  //     commonjs(),
  //     // filesize(),
  //     uglify()
  //   ]
  // }
  ).then(function (bundle) {
    var dirname = path.dirname(dest),
      basename = path.basename(dest, '.js'),
      destMin = path.join(dirname, basename) + '.min.js';
    console.log('[bundle-js]: minifying: ', destMin);
    return bundle.write({
      format: format,
      moduleName: moduleName,
      globals: externalMappings,
      dest: destMin,
      useStrict: false // NOTE: necessary for Safari when using web components. See https://github.com/ibm-js/delite/issues/259
    });
  }));

  return Promise.all(tps);
}
