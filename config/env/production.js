// config/env/production.js

(function() {
	'use strict';
	
	module.exports = {
		db: {
			url : process.env.DB_URL || 'mongodb://localhost:27017/RESTfulAPIExample'
		},
		port: 8080,
		tokenSecret: 'secret-value',
		tokenExpiresAfterHours: 24
	};
	
})();

