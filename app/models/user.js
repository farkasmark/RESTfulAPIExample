// app/models/user.js
"use strict";

(function() {

	exports = module.exports = function(db, logger, crypt) {
		
		// create a user model
		var UserDataAccessLayer = db.model('User', {
			username: { type: String, required: true, index: { unique: true } },
			password: { type: String, required: true }
		});
		
		UserDataAccessLayer.preSave(function(user, next) {
			// only hash the password if it has been modified (or is new)
			if (!user.isModified('password')) return next();

			// generate a salt
			crypt.generateSalt(function(err, salt) {
				if (err) return next(err);

				// hash the password along with our new salt
				crypt.hashPassword(user.password, salt, function(err, hash) {
					if (err) return next(err);

					logger.info('Password used to be ' + user.password + ' and became ' + hash);
					
					// override the cleartext password with the hashed one
					user.password = hash;
					next();
				});
			});
		});
		
		UserDataAccessLayer.comparePassword = function(user, password, callback) {
			crypt.comparePassword(password, user.password, callback);
		};
				
		return UserDataAccessLayer;
	}; 

	exports['@singleton'] = true;
	exports['@require'] = [ 'db', 'logger', 'crypt' ];
	
})();