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
	
	User.create({ username: 'bob4', password: 'titok' }, function(err) {
		if (err) {
			logger.error(err);
		}
		logger.info('User created.');
	});
})();