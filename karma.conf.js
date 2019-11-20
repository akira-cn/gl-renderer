module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      {
        pattern: 'src/**/*.js',
        watch: false
      },
      {
        pattern: 'test/**/*.js'
      }
    ],
    preprocessors: {
      'src/**/*.js': ['webpack'],
      'test/**/*.js': ['webpack']
    },
    webpack: require('./webpack.config.js')({ env: 'development' }),
    webpackMiddleware: { stats: 'errors-only' },
    browsers: ['ChromeHeadless'],
    reporters: ['coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: ['html', 'lcov'],
      dir: 'coverage',
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      },
      // thresholds: {
      //   emitWarning: true,
      //   each: {
      //     overrides: {
      //       'src/helpers.js': {
      //         statements: 90,
      //         lines: 90,
      //         branches: 90,
      //         functions: 90
      //       },
      //       'src/renderer.js': {
      //         statements: 90,
      //         lines: 90,
      //         branches: 90,
      //         functions: 90
      //       }
      //     }
      //   }
      // },
      verbose: false,
      instrumentation: {
        'default-excludes': true
      }
    }
  })
}
