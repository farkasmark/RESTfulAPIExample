// app/handlers/authHandler.js

(function() {
	
	var url = require('url');
	
	exports = module.exports = function(User, logger, token, settings) {

		var authenticationErrorMsg400	= 'Authentication error';
		var authenticationErrorCode400	= 400;
		var authenticationErrorMsg401	= 'Not authorized';
		var authenticationErrorCode401	= 401;

		//
		// --- middleware to use for all AUTHENTICATED requests ---
		//
		function processAuthLogRequest(req, res, next) {
			// do logging
			logger.info('Accessing authenticated API...');
			next(); // make sure we go to the next routes and don't stop here
		}	
		
		function processAuthLoadFromDb(req, res, next) {
			// Parse the URL, we might need this
			var parsed_url = url.parse(req.url, true)
			
			/**
			 * Take the token from:
			 * 
			 *  - the POST value access_token
			 *  - the GET parameter access_token
			 *  - the x-access-token header
			 *    ...in that order.
			 */
			var accessToken = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];
			if (accessToken) {
				// get token secret
				var tokenSecret = settings.tokenSecret;
				// verify token and obtain token issuer
				token.verifyToken(accessToken, tokenSecret, function(err, tokenIssuer) {
					if(err) {
						// Access token has expired
						return res.status(authenticationErrorCode400).send(authenticationErrorMsg400);
					}
					// use our user model to find the user we want
					User.findById(tokenIssuer, function(err, user) {
						// fetch the appropriate user, if they exist
						if (err || !user) {
							// user cannot be found; may wish to log that fact here. For simplicity, just return a 400
							logger.error(req.ip + ' ' + req.headers['user-agent'] + ' tried to use token, but user with id ' + tokenIssuer + ' was not found.');
							// send back 400
							return res.status(authenticationErrorCode400).send(authenticationErrorMsg400);
						}
						// set request user
						req.user = tokenIssuer;
						return next();
					});
				});
			} else {
				next();
			}
		}
		
		function processAuthToken(req, res, next) {
			if (!req.user) {
				// send back 401
				return res.status(authenticationErrorCode401).send(authenticationErrorMsg401);
			}
			next();			
		}
		
		//
		// Return handler.
		//
		return {
			processAuth: [ 
				processAuthLogRequest,
				processAuthLoadFromDb,
				processAuthToken
			]
		};
	};

	/**
	 * Component annotations.
	 */
	exports['@require'] = [ 'user', 'logger', 'token', 'settings' ];
	
})();