(function() {
	'use strict';
	
	// include gulp
	var gulp = require('gulp'); 
	
	// include plug-ins
	var jshint = require('gulp-jshint');
	
	var paths = {
		scripts: ['**/*.js', '!node_modules/**/*.js'],
		images: 'client/img/**/*'
	};
	
	// JS hint task
	gulp.task('jshint', function() {
	gulp.src(paths.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
	});
})();
