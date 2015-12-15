// app/handlers/allRequestHandler.js

(function() {
	'use strict';
	
	exports = module.exports = function(db, logger) {
	  
		//
		// --- middleware to use for all requests ---
		//
		function processAllRequestLogRequest(req, res, next) {
			// do logging
			logger.info('Something is happening. :)');
			next(); // make sure we go to the next routes and don't stop here
		}

		function processAllRequestConnectToDb(req, res, next) {
			// if not connected ..
			if (!db.isConnected()) {
				// perform database connection
				db.connect(function(err) {
					if (err) {
						logger.error(err);
						res.sendStatus(500);
					} else {
						db.connect();
						logger.info('Connected to database.');
						next();
					}
				});
			} else {
				next();
			}
		}
		
		//
		// Return handler.
		//
		return {
			processAllRequests: [ 
				processAllRequestLogRequest,
				processAllRequestConnectToDb
			]
		};
	};

	/**
	 * Component annotations.
	 */
	exports['@require'] = [ 'db', 'logger' ];
	
})();