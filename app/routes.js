// app/routes.js

(function() {

	exports = module.exports = function(allRequestHandler, tokenHandler, bearHandler, logger) {
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
					.post(bearHandler.createBear)
					// get all the bears (accessed at GET http://localhost:3000/api/bears)
					.get(bearHandler.getBears);
				
				//
				// on routes that end in /bears/:bear_id
				//
				router.route('/bears/:bear_id')
					// get the bear with that id (accessed at GET http://localhost:3000/api/bears/:bear_id)
					.get(bearHandler.getBear)
					// update the bear with this id (accessed at PUT http://localhost:3000/api/bears/:bear_id)
					.put(bearHandler.updateBear)
					// delete the bear with this id (accessed at DELETE http://localhost:3000/api/bears/:bear_id)
					.delete(bearHandler.deleteBear);
			}
		}
	};
	
	exports['@singleton'] = true;
	exports['@require'] = [ 'allRequestHandler', 'tokenHandler', 'bearHandler', 'logger'];
	
})();