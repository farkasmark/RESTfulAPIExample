// app/models/bear.js
"use strict";

(function() {

	exports = module.exports = function(db) {
		// create a bear model
		return db.model('Bear', {
			name: String
		});
	}; 

	exports['@singleton'] = true;
	exports['@require'] = [ 'db' ];
})();