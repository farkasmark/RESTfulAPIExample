// app/routes.js

(function() {

	// use Express middleware
	var express			= require('express');			
	
	exports = module.exports = function(db, logger) {
		return {
			configure: function(app, models) {

				// get an instance of the express Router
				var router = express.Router();		
				
				//
				// --- middleware to use for all requests ---
				//
				router.use(function(req, res, next) {
					// do logging
					logger.info('Something is happening.');
					next(); // make sure we go to the next routes and don't stop here
				});

				router.use(function(req, res, next) {
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
				});
				
				//
				// --- routes for our api ---
				//
				
				// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
				router.get('/', function(req, res) {
					res.json({ message: 'hooray! welcome to our api!' });   
				});
		
				//
				// on routes that end in /bears
				//		
				router.route('/bears')
					// create a bear (accessed at POST http://localhost:3000/api/bears)
					.post(function(req, res) {
						// get the bear's name
						var name = req.body.name;
						// call the bear data access layer
						models.Bear.create({ name: name }, function(err) {
							if (err) {
								logger.error(err);
								res.send(err);
							}
								
							res.json({message: 'Bear created! Welcome ' + name + '.'});
						});	
					})
					
					// get all the bears (accessed at GET http://localhost:3000/api/bears)
					.get(function(req, res) {
						
						models.Bear.find(function(err, bears) {
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
				router.route('/bears/:bear_id')
					// get the bear with that id (accessed at GET http://localhost:3000/api/bears/:bear_id)
					.get(function(req, res) {
						// use our bear model to find the bear we want
						models.Bear.findById(req.params.bear_id, function(err, bear) {
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
						models.Bear.update(req.params.bear_id, { name: req.body.name }, {
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
						models.Bear.remove(req.params.bear_id, function(err, bear) {
							if (err) {
								logger.error(err);
								res.send(err);
							}
							
							res.json({ message: 'Bear deleted!'});
						});
					});
					
				// all of our routes will be prefixed with /api
				app.use('/api', router);
			}
		}
	};
	
	exports['@singleton'] = true;
	exports['@require'] = [ 'db', 'logger' ];
	
})();