# redsift-bundler

`redsift-bundler` is a collection of functionality which takes care of the bundling and building process of a Javascript ES2015 application. It supports

* bundling of an ES2015 Javascript application/library into a single ES2015 file for distribution
* the creation of a ES5 version of the bundler
* the creation of a single CSS file from a set of CSS or [Stylus](stylus-lang.com) files (with support for creating multiple CSS themes easily).

`redsift-bundler` comes in two flavours. You can either use it as a standalone tool which makes it easy to quickly build an app/lib from the command line. The standalone tool can also be integrated into your NPM workflow e.g. as `npm build` command.

The second, more flexible alternative is to integrate the bundling functionaltiy via the [Gulp](http://gulpjs.com/) build tool. Simply use our handy Gulp tasks directly in your `gulpfile`.

The setup of the distribution bundle is done in a single configuration file for the standalone usage, as well as for using the gulp tasks. See below on how to configure your application/library.

The idea of this bundler is to have a central tool which takes care of the repetitive task of creating distribution bundles from a Javascript application/library. Maintaining the build process of many different Javascript projects e.g. with a `gulpfile` becomes tedious when you enhance or fix something, because every `gulpfile` in each repository has to be updated. The `redsift-bundler` solves this problem. Include it in your project as NPM module and simply update the module, if necessary.

# Installation

If you are using the bundler on the command line install it globally:

```bash
npm install -g @redsift/redsift-bundler
```

When using it directly with `gulp` do a project local installation:

```bash
npm install --save-dev @redsift/redsift-bundler
```

# Command line usage

```bash
Usage: redsift-bundler -c [config-file]

Options:
  -c  Bundle configuration file [required]
```

> CAUTION: For the `redsift-bundler` executable to exist it has to be installed globally before!

The bundler needs a configuration file which is oriented very close to the configuration properties of [Rollup](http://rollupjs.org/). Have a look at Rollup's documentation to understand the used options in detail.

# Usage as NPM command

To be able to run the bundler as NPM command add the following configuration to your `package.json` file within the `script` section:

```javascript
"scripts": {
    "build": "redsift-bundler -c ./bundle.config.js",
    ...
  }
```

If you prefer not to use the globally installed version of the bundler for the NPM command install it locally first and use this configuration:

```javascript
"scripts": {
    "build": "./node_modules/@redsift/redsift-bundler -c ./bundle.config.js",
    ...
  }
```

This allows you to call

```bash
npm run build
```

in the project folder to create the bundle(s).

# Using the gulp tasks directly (fastest and most flexible)

If you already have a Gulpfile (or simply want to use Gulp instead of the standalone bundler) add the following lines to your `gulpfile`:

```javascript
var RSBundler = require('@redsift/redsift-bundler');
var bundleConfig = require('./bundle.config.js');

gulp.task('bundle-js', RSBundler.loadTask(gulp, 'bundle-js', bundleConfig));
gulp.task('bundle-css', RSBundler.loadTask(gulp, 'bundle-css', bundleConfig));

gulp.task('build', ['bundle-js', 'bundle-css'], function() {
  console.log('\n* Bundling complete:\n');
  RSBundler.printBundleSummary(bundleConfig);
});
```

`RSBundler` takes care of loading the two tasks for bundling Javascript (`bundle-js`) and CSS (`bundle-css`) and sets them up with the `bundleConfig`. `gulp build` will run both tasks and prints a bundle summary after a successful build.

## Configuration file

This example configuration file takes the ES2015 Javascript file `./src/js/index.js` and the Stylus file `./src/styles/index.styl` and outputs the bundled files into `./dist/mybundle`. The folder will contain a `js` and a `css` sub folder with the bundled files and outputs a non-minified and a minified version of the bundle together with sourcemaps. If your are bundling a library the exported Javascript functionality will be accessible via the global variable `window.MyBundle` after importing the bundle.

```javascript
var paths = {
  dest: './dist'
}

// We create a single bundle:
var myBundleConfig = {
  // the Javascript index file. Output Javascript will be written to a file with the given 'name' within 'outputFolder/js'
  mainJS: {
    name: 'mybundle',
    indexFile: './src/js/index.js'
  },  
  // the CSS/Stylus index file. Output CSS will be written to a file with the given 'name' within 'outputFolder/css'
  // multiple output files can be created, e.g. to create multiple CSS themes (see the real-world example below)
  styles: [{
    name: 'mybundle',
    indexFile: './src/index.styl'
  }],
  // list of formats which are going to be created. Valid formats are described in the Rollup documentation
  formats: ['es6', 'umd'],
  // the output folder of the bundle
  outputFolder: paths.dest,
  // the module name that the exported JS code will be accessible at in the global namespace. Used by 'umd' and 'cjs' export formats (no function for 'es6' export)
  moduleNameJS: 'MyBundle',
  // The destination of the sourcemaps relative to 'outputFolder'
  mapsDest: '.',
  // external mappings allow you to exclude the bundling of the named libraries. See the 'real world' example and the
  // Rollup documentation regarding this option. For the simple example we are including everything into the bundle, so
  // there is no need for that here.
  externalMappings: {
    // 'd3': 'd3'
  }
};

// export the config as array. Multiple bundles can be defined (see real-world example below)
module.exports = [ myBundleConfig ];
```

For a another simple example have a look at the [@redsift/ui-rs-core](https://github.com/Redsift/ui-rs-core/blob/master/bundle.config.js) repository.

A real world example with multiple bundles, multiple themes and external mappings is available in the [@redsift/redsift-ui](https://github.com/Redsift/redsift-ui/blob/master/redsift-ui.config.js) repository.
