module.exports = function (config) {
    'use strict';
    config.set({

        basePath: '',

        frameworks: ['mocha', 'chai', 'sinon'],

        files: [          
            // simple patterns to load the needed testfiles
            {pattern: 'test/unit/*.spec.js', watched: true, served: true, included: true}
        ],

        reporters: ['spec'],

        port: 9876,
        colors: true,
        autoWatch: true,
        singleRun: false,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        browsers: ['PhantomJS']

    });
};