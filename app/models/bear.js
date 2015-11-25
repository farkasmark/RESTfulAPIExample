// app/models/bear.js

(function() {

	exports = module.exports = function(db) {
		// create a bear model
		return db.model('Bear', {
			name: String
		});
	}; 

	exports['@singleton'] = false;
	exports['@require'] = [ 'db' ];
})();