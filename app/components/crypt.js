// app/crypt.js

(function() {
		
	//
	// Crypt class.
	//
	function Crypt() {		
	}

	Crypt.prototype.constructor = Crypt;
	Crypt.prototype.comparePassword = function(password, callback) {
	};
	
	//
	// BCrypt class.
	//
	function BCrypt() {
		
		// use bcrypt library
		this.bcrypt = require('bcrypt');
		this.SALT_WORK_FACTOR = 10;
		
		// call base constructor
		Crypt.call(this);
	}
	
	// Make our prototype from BCrypt.prototype so we inherit Crypt's methods
	BCrypt.prototype = Object.create(Crypt.prototype);
	BCrypt.prototype.constructor = BCrypt;
	BCrypt.prototype.comparePassword = function(password, hash, callback) {
		this.bcrypt.compare(password, hash, function(err, isMatch) {
			if (err) {
				return callback(err);
			}
			callback(null, isMatch);
		});			
	};
	
	//
	// Initialize crypt.
 	//
	// This component initializes the application's crypto provider.
	//
	exports = module.exports = function() {
		return new BCrypt();
	};
	
	exports['@singleton'] = true;
	
})();