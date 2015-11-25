// config/settings.js

(function() {

	exports = module.exports = function() {
		
		var env = process.env.NODE_ENV || 'development';
		var settings = require('./env/' + env);

		return settings;
	}
	
	exports['@singleton'] = true;
	
})();