// app/crypt.js
"use strict";

(function() {
		
	//
	// Crypt class.
	//
	function Crypt() {		
	}

	Crypt.prototype.constructor = Crypt;
	
	Crypt.prototype.comparePassword = function(password, callback) {
	};
	
	Crypt.prototype.generateSalt = function(callback) {
	};
	
	Crypt.prototype.hashPassword = function(password, salt, callback) {	
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
		// call base class method
		Crypt.prototype.comparePassword.call(this, password, hash, callback);
		// call bcrypt implementation
		this.bcrypt.compare(password, hash, function(err, isMatch) {
			if (err) {
				return callback(err);
			}
			callback(null, isMatch);
		});			
	};
	
	BCrypt.prototype.generateSalt = function(callback) {
		// call base class method
		Crypt.prototype.generateSalt.call(this, callback);
		// call bcrypt implementation
		this.bcrypt.genSalt(this.SALT_WORK_FACTOR, callback);
	};
	
	BCrypt.prototype.hashPassword = function(password, salt, callback) {
		// call base class method
		Crypt.prototype.hashPassword.call(this, password, salt, callback);
		// call bcrypt implementation
		this.bcrypt.hash(password, salt, callback);	
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