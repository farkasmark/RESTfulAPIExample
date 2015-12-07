// app/handlers/bearHandler.js

(function() {

	exports = module.exports = function(Bear, logger) {
	  
		//
		// Get all bears.
		//
		function getBearsLogRequest(req, res, next) {
			logger.info(req.ip + ' ' + req.headers['user-agent']);
			next();
		}

		function getBearsLoadFromDb(req, res, next) {
			Bear.find(function(err, bears) {
				if (err) {
					logger.error(err);
					res.send(err);
				}
				
				res.json(bears);
			});
		}
	  
		//
		// Get a bear.
		//
		function getBearLogRequest(req, res, next) {
			logger.info('Egy macko nem macko...');
			logger.info(req.ip + ' ' + req.headers['user-agent']);
			next();
		}

		function getBearValidateItem(req, res, next) {
			if (!req.params.bear_id) {
				return res.send('Bears must have an identifier');
			}
			next();
		}

		function getBearLoadFromDb(req, res, next) {
			// use our bear model to find the bear we want
			Bear.findById(req.params.bear_id, function(err, bear) {
				if (err) {
					logger.error(err);
					res.send(err);
				}
				   
				res.json(bear);	
			});
		}	

		//
		// Create a bear.
		//
		function createBearLogRequest(req, res, next) {
			logger.info(req.ip + ' ' + req.headers['user-agent']);
			next();
		}

		function createBearValidateItem(req, res, next) {
			if (!req.body.name) {
				return res.send('Bear must have a name');
			}
			next();
		}

		function createBearSaveToDb(req, res, next) {
			// get the bear's name
			var name = req.body.name;
			// call the bear data access layer
			Bear.create({ name: name }, function(err) {
				if (err) {
					logger.error(err);
					res.send(err);
				}
					
				res.json({message: 'Bear created! Welcome ' + name + '.'});
			});	
		}	
		
		//
		// Update a bear.
		//
		function updateBearLogRequest(req, res, next) {
			logger.info(req.ip + ' ' + req.headers['user-agent']);
			next();
		}

		function updateBearValidateItem(req, res, next) {
			if (!req.params.bear_id) {
				return res.send('Bears must have an identifier');
			}
			if (!req.body.name) {
				return res.send('Bear must have a name');
			}
			next();
		}

		function updateBearSaveToDb(req, res, next) {
			// use our bear model to find the bear we want
			Bear.update(req.params.bear_id, { name: req.body.name }, {
				// on find 
				onFind: function(err) {
					if (err) {
						logger.error(err);
						res.send(err);
					}
				},
				// on finish
				onFinish: function(err, bear) {
					if (err) {
						logger.error(err);
						res.send(err);
					}

					res.json({ message: 'Bear updated! Welcome ' + bear.name + '.' });
				}
			});
		}		
		
		//
		// Delete a bear.
		//
		function deleteBearLogRequest(req, res, next) {
			logger.info(req.ip + ' ' + req.headers['user-agent']);
			next();
		}
		
		function deleteBearValidateItem(req, res, next) {
			if (!req.params.bear_id) {
				return res.send('Bears must have an identifier');
			}
			next();
		}	

		function deleteBearSaveToDb(req, res, next) {
			// use our bear model to delete the bear we want
			models.Bear.remove(req.params.bear_id, function(err, bear) {
				if (err) {
					logger.error(err);
					res.send(err);
				}
				
				res.json({ message: 'Bear deleted!'});
			});
		}	
		
		//
		// Return handler.
		//
		return {
			getBears: [ 
				getBearsLogRequest,
				getBearsLoadFromDb
			],
			getBear: [
				getBearLogRequest,
				getBearValidateItem,
				getBearLoadFromDb
			],
			createBear: [
				createBearLogRequest,
				createBearValidateItem,
				createBearSaveToDb
			],
			updateBear: [
				updateBearLogRequest,
				updateBearValidateItem,
				updateBearSaveToDb
			],
			deleteBear: [
				deleteBearLogRequest,
				deleteBearValidateItem,
				deleteBearSaveToDb
			]
		};
	}

	/**
	 * Component annotations.
	 */
	exports['@require'] = [ 'bear', 'logger' ];
	
})();