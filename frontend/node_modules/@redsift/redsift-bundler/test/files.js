const path = require('path');

const config = {
  tmpFolder: path.join('test/tmp'),
  es6: {
    inputFile: path.join('test', 'es6', 'input.js'),
    rollupCLI: {
      config: {
        prod: path.join('test', 'es6', 'rollup.config.prod.js'),
        dev: path.join('test', 'es6', 'rollup.config.dev.js'),
      },
      created: {
        outputFile: path.join('test', 'tmp', 'es6', 'output', 'rollup-cli', 'js', 'es6.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'tmp', 'es6', 'output', 'rollup-cli', 'js', 'es6.umd-es2015.js')
      },
      reference: {
        outputFile: path.join('test', 'es6', 'ref-output', 'rollup-cli', 'js', 'es6.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'es6', 'ref-output', 'rollup-cli', 'js', 'es6.umd-es2015.js')
      }
    },
    webpackGulp: {
      created: {
        outputFolder: path.join('..', 'tmp', 'es6', 'output', 'webpack-gulp'),
        outputFile: path.join('test', 'tmp', 'es6', 'output', 'webpack-gulp', 'js', 'es6.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'tmp', 'es6', 'output', 'webpack-gulp', 'js', 'es6.umd-es2015.js')
      },
      reference: {
        outputFile: path.join('test', 'es6', 'ref-output', 'webpack-gulp', 'js', 'es6.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'es6', 'ref-output', 'webpack-gulp', 'js', 'es6.umd-es2015.js')
      }
    }
  },
  reactJSX: {
    inputFile: path.join('test', 'react-jsx', 'input.js'),
    rollupCLI: {
      config: {
        prod: path.join('test', 'react-jsx', 'rollup.config.prod.js'),
        dev: path.join('test', 'react-jsx', 'rollup.config.dev.js'),
      },
      created: {
        outputFile: path.join('test', 'tmp', 'react-jsx', 'output', 'rollup-cli', 'js', 'react-jsx.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'tmp', 'react-jsx', 'output', 'rollup-cli', 'js', 'react-jsx.umd-es2015.js')
      },
      reference: {
        outputFile: path.join('test', 'react-jsx', 'ref-output', 'rollup-cli', 'js', 'react-jsx.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'react-jsx', 'ref-output', 'rollup-cli', 'js', 'react-jsx.umd-es2015.js')
      }
    },
    webpackGulp: {
      created: {
        outputFolder: path.join('..', 'tmp', 'react-jsx', 'output', 'webpack-gulp'),
        outputFile: path.join('test', 'tmp', 'react-jsx', 'output', 'webpack-gulp', 'js', 'react-jsx.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'tmp', 'react-jsx', 'output', 'webpack-gulp', 'js', 'react-jsx.umd-es2015.js')
      },
      reference: {
        outputFile: path.join('test', 'react-jsx', 'ref-output', 'webpack-gulp', 'js', 'react-jsx.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'react-jsx', 'ref-output', 'webpack-gulp', 'js', 'react-jsx.umd-es2015.js')
      }
    }
  },
  json: {
    inputFile: path.join('test', 'json', 'input.js'),
    rollupCLI: {
      config: {
        prod: path.join('test', 'json', 'rollup.config.prod.js'),
        dev: path.join('test', 'json', 'rollup.config.dev.js'),
      },
      created: {
        outputFile: path.join('test', 'tmp', 'json', 'output', 'rollup-cli', 'js', 'json.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'tmp', 'json', 'output', 'rollup-cli', 'js', 'json.umd-es2015.js')
      },
      reference: {
        outputFile: path.join('test', 'json', 'ref-output', 'rollup-cli', 'js', 'json.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'json', 'ref-output', 'rollup-cli', 'js', 'json.umd-es2015.js')
      }
    },
    webpackGulp: {
      created: {
        outputFolder: path.join('..', 'tmp', 'json', 'output', 'webpack-gulp'),
        outputFile: path.join('test', 'tmp', 'json', 'output', 'webpack-gulp', 'js', 'json.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'tmp', 'json', 'output', 'webpack-gulp', 'js', 'json.umd-es2015.js')
      },
      reference: {
        outputFile: path.join('test', 'json', 'ref-output', 'webpack-gulp', 'js', 'json.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'json', 'ref-output', 'webpack-gulp', 'js', 'json.umd-es2015.js')
      }
    }
  },
  htmlImport: {
    inputFile: path.join('test', 'html-import', 'input.js'),
    rollupCLI: {
      config: {
        prod: path.join('test', 'html-import', 'rollup.config.prod.js'),
        dev: path.join('test', 'html-import', 'rollup.config.dev.js'),
      },
      created: {
        outputFile: path.join('test', 'tmp', 'html-import', 'output', 'rollup-cli', 'js', 'html-import.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'tmp', 'html-import', 'output', 'rollup-cli', 'js', 'html-import.umd-es2015.js')
      },
      reference: {
        outputFile: path.join('test', 'html-import', 'ref-output', 'rollup-cli', 'js', 'html-import.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'html-import', 'ref-output', 'rollup-cli', 'js', 'html-import.umd-es2015.js')
      }
    },
    webpackGulp: {
      created: {
        outputFolder: path.join('..', 'tmp', 'html-import', 'output', 'webpack-gulp'),
        outputFile: path.join('test', 'tmp', 'html-import', 'output', 'webpack-gulp', 'js', 'html-import.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'tmp', 'html-import', 'output', 'webpack-gulp', 'js', 'html-import.umd-es2015.js')
      },
      reference: {
        outputFile: path.join('test', 'html-import', 'ref-output', 'webpack-gulp', 'js', 'html-import.umd-es2015.min.js'),
        outputFileDev: path.join('test', 'html-import', 'ref-output', 'webpack-gulp', 'js', 'html-import.umd-es2015.js')
      }
    }
  }
}

module.exports = config;
