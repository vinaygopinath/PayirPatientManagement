'use strict';

module.exports = function (karma) {
    karma.set({

        frameworks: ['jasmine', 'browserify'],

        //Paths are relative to karma.conf.js
        files: [
      '../app/bower_components/angular/angular.js',
        '../app/bower_components/angular-animate/angular-animate.js',
        '../app/bower_components/angular-aria/angular-aria.js',
        '../app/bower_components/angular-route/angular-route.js',
        '../app/bower_components/angular-material/angular-material.js',
        '../app/bower_components/angular-mocks/angular-mocks.js',
        '../app/scripts/{,*/}*.js',
        'spec/{,*/}*.js'
    ],


        reporters: ['mocha'],

        preprocessors: {
            'spec/{,*/}*.js': ['browserify'],
        },

        browsers: ['PhantomJS'],
        colors: true,

        logLevel: 'LOG_DEBUG',

        singleRun: true,
        autoWatch: false,

        // browserify configuration
        browserify: {
            require: ['nedb', 'path']
        }
    });
};