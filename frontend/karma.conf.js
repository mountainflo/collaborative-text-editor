module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    files: [
      {pattern: 'spec/*.js'},
    ],
    preprocessors: {
      'spec/*.js': ['webpack'],
    },
    webpack: require('./webpack.development.config'),
    reporters: ['spec'],
    browsers: ['ChromeHeadlessCustom'],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--headless', '--remote-debugging=9222'],
      },
      ChromeDebugging: {
        base: 'Chrome',
        flags: ['--remote-debugging=9222'],
        debug: true,
      },
    },
  });
};
