// config/settings.js

(function() {
	'use strict';
	
	var rfr = require('rfr');
		
	exports = module.exports = function() {
		var env = process.env.NODE_ENV || 'development';
		var settings = rfr('/config/env/' + env);
		return settings;
	};
	
	exports['@singleton'] = true;
	
})();