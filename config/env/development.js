// config/env/development.js

(function() {
	'use strict';
	
	module.exports = {
		db: {
			url : 'mongodb://localhost:27017/RESTfulAPIExample'
		},
		port: 8080,
		tokenSecret: 'secret-value',
		tokenExpiresAfterHours: 24
	};
	
})();

