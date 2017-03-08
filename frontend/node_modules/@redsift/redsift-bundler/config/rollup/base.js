const babel = require('rollup-plugin-babel');
const cjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const globals = require('rollup-plugin-node-globals');
const resolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const eslint = require('rollup-plugin-eslint');
const filesize = require('rollup-plugin-filesize');

module.exports = {
  format: 'umd',
  plugins: [
    json(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [ [ 'es2015', { modules: false } ], 'stage-0', 'react' ],
      plugins: [ 'external-helpers', 'transform-decorators-legacy' ]
    }),
    cjs({
      exclude: 'node_modules/process-es6/**',
      include: [
        'node_modules/fbjs/**',
        'node_modules/object-assign/**',
        'node_modules/react/**',
        'node_modules/react-dom/**'
      ],
      ignoreGlobals: false,
      sourceMap: false,
      // see https://github.com/rollup/rollup-plugin-commonjs for namedExports issue
      // namedExports: { './module.js': ['foo', 'bar' ] }  // Default: undefined
    }),
    eslint({ // NOTE: include this AFTER cjs(). Results in 'React does not export default' error otherwise!
      configFile: '.eslintrc',
      exclude: 'node_modules/**',
    }),
    globals(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    resolve({
      modules: true,
      jsnext: true,
      browser: true,
      main: true,
      extensions: [ '.js', '.json' ],
    }),
    filesize()
  ],
  sourceMap: true
};
