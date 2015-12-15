(function() {
	'use strict';
	
	// include path
	var path = require('path');
	// include gulp
	var gulp = require('gulp');
	// include nodemon plug-in
	var nodemon = require('gulp-nodemon');
	// include jshint plug-in
	var jshint = require('gulp-jshint');
	// include karma server
	var KarmaServer = require('karma').Server;
	
	var paths = {
		scripts: ['**/*.js', '!node_modules/**/*.js'],
		karmaConfigFile: 'karma.conf.js'
	};
	
	// JS hint task
	gulp.task('lint', function() {
	gulp.src(paths.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
	});
	
	/**
	* Run test once and exit
	*/
	gulp.task('test', function (done) {
		new KarmaServer({
			configFile: path.join(__dirname, paths.karmaConfigFile),
			singleRun: true
		}, done).start();
	});
	
	/**
	* Watch for file changes and re-run tests on each change
	*/
	gulp.task('tdd', function (done) {
		new KarmaServer({
			configFile: path.join(__dirname, paths.karmaConfigFile)
		}, done).start();
	});
	
	gulp.task('develop', function () {
		nodemon({
				script: 'server.js', 
				ext: 'html js',
				env: { 'NODE_ENV': 'development' },
				ignore: ['gulpfile.js'], 
				tasks: ['lint', 'test'] 
			})
			.on('restart', function () {
				console.log('restarted!');
			});
	});
	
	// Default Task
	gulp.task('default', ['lint', 'test', 'develop']);
})();
