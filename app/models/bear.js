// app/models/bear.js

(function() {

	module.exports = function(db) {
		// create a bear model
		return db.model('Bear', {
			name: String
		});
	}; 

})();