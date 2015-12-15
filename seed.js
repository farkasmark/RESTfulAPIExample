// seed.js
"use strict";

/**
 * Seed.js - seeds the database. I.e. it creates a dummy user.
 */

(function() {

	//
	// --- use IoC pattern ---
	//
	
	var IoC	= require('electrolyte');
	
	IoC.use(IoC.node('app'));
	IoC.use(IoC.node('app/components'));
	IoC.use(IoC.node('app/models'));
	IoC.use(IoC.node('app/handlers'));
	IoC.use(IoC.node('config'));

	// use logger
	var logger = IoC.create('logger');
	
	var db = IoC.create('db');
	// if not connected ..
	if (!db.isConnected()) {
		// perform database connection
		db.connect(function(err) {
			if (err) {
				logger.error(err);
			} else {
				db.connect();
				logger.info('Connected to database.');
			}
		});
	}
	
	// use the user model we just created
	var User = IoC.create('user');
	
	var username = 'bob21';
	var password = 'titok';
	
	User.findOne({username: username}, function(err, user) {
		if(err) {
			logger.error(err);
		} else {
			if(!user) {
				// user cannot be found
				logger.info('No user found. Creating one...');
				
				user = User.create({ username: username, password: password }, function(err) {
					if (err) {
						logger.error(err);
					} else {
						logger.info('User created.');
						
						User.comparePassword(user, password, function(err, isMatch) {
							if (err) {	      		
								logger.error(err);
							}
							if(isMatch) {
								logger.info('Great.');
							} else {
								logger.info('Not good.');
							}
						});
					}
				});
							
			} else {
				logger.info('User already exists.');
			}
		}	
	});

})();