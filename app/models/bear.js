// app/models/bear.js

(function() {
	'use strict';
	
	exports = module.exports = function(db) {
		// create a bear model
		return db.model('Bear', {
			name: String
		});
	}; 

	exports['@singleton'] = true;
	exports['@require'] = [ 'db' ];
})();