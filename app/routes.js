// app/routes.js

(function() {
	
	// use the logger
	var logger	= require('./logging.js');
	
	// use the database
	var db		= require('./db.js').db;
	
	// use the bear model we just created
	var Bear	= require('./models/bear')(db);
	
	module.exports = {
		configure: function(app, apiRouter) {
			
			//
			// --- middleware to use for all requests ---
			//
			apiRouter.use(function(req, res, next) {
				// do logging
				logger.info('Something is happening.');
				next(); // make sure we go to the next routes and don't stop here
			});
			
			apiRouter.use(function(req, res, next) {
				// if not connected ..
				if (!db.isConnected()) {
					// perform database connection
					db.connect(function(err) {
						if(err) {
							logger.error(err);
							res.sendStatus(500);
						}
						else {
							db.connect();
							logger.info('Connected to database.');
							next();
						}
					});
				} else {
					next();
				}
			});
			
			//
			// --- routes for our api ---
			//
			
			// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
			apiRouter.get('/', function(req, res) {
				res.json({ message: 'hooray! welcome to our api!' });   
			});
	
			//
			// on routes that end in /bears
			//		
			apiRouter.route('/bears')
				// create a bear (accessed at POST http://localhost:3000/api/bears)
				.post(function(req, res) {
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
				})
				
				// get all the bears (accessed at GET http://localhost:3000/api/bears)
				.get(function(req, res) {
					
					Bear.find(function(err, bears) {
						if (err) {
							logger.error(err);
							res.send(err);
						}
						
						res.json(bears);
					});
					
				});
				
			//
			// on routes that end in /bears/:bear_id
			//
			apiRouter.route('/bears/:bear_id')
				// get the bear with that id (accessed at GET http://localhost:3000/api/bears/:bear_id)
				.get(function(req, res) {
					// use our bear model to find the bear we want
					Bear.findById(req.params.bear_id, function(err, bear) {
						if (err) {
							logger.error(err);
							res.send(err);
						}
						   
						res.json(bear);	
					});
				})
				
				// update the bear with this id (accessed at PUT http://localhost:3000/api/bears/:bear_id)
				.put(function(req, res){
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
				})
				
				// delete the bear with this id (accessed at DELETE http://localhost:3000/api/bears/:bear_id)
				.delete(function(req, res) {
					// use our bear model to delete the bear we want
					Bear.remove(req.params.bear_id, function(err, bear) {
						if (err) {
							logger.error(err);
							res.send(err);
						}
						
						res.json({ message: 'Bear deleted!'});
					});
				});
			
			// all of our routes will be prefixed with /api
			app.use('/api', apiRouter);
		}
	};
	
})();