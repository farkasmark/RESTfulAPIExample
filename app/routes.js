// app/routes.js

(function() {
	'use strict';
	
	exports = module.exports = function(allRequestHandler, tokenHandler, authHandler, bearHandler, logger) {
		return {
			configure: function(router) {
				
				//
				// --- middleware to use for all requests ---
				//
				router.use(allRequestHandler.processAllRequests);
				
				//
				// --- routes for our api ---
				//
				
				// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
				router.get('/', function(req, res) {
					res.json({ message: 'hooray! welcome to our api! :)' });   
				});
		
				//
				// token based authentication endpoint
				//
				router.get('/token', tokenHandler.getToken);
		
				//
				// on routes that end in /bears
				//		
				router.route('/bears')
					// create a bear (accessed at POST http://localhost:3000/api/bears)
					.post(authHandler.processAuth, bearHandler.createBear)
					// get all the bears (accessed at GET http://localhost:3000/api/bears)
					.get(authHandler.processAuth, bearHandler.getBears);
				
				//
				// on routes that end in /bears/:bear_id
				//
				router.route('/bears/:bear_id')
					// get the bear with that id (accessed at GET http://localhost:3000/api/bears/:bear_id)
					.get(authHandler.processAuth, bearHandler.getBear)
					// update the bear with this id (accessed at PUT http://localhost:3000/api/bears/:bear_id)
					.put(authHandler.processAuth, bearHandler.updateBear)
					// delete the bear with this id (accessed at DELETE http://localhost:3000/api/bears/:bear_id)
					.delete(authHandler.processAuth, bearHandler.deleteBear);
			}
		};
	};
	
	exports['@singleton'] = true;
	exports['@require'] = [ 'allRequestHandler', 'tokenHandler', 'authHandler', 'bearHandler', 'logger'];
	
})();