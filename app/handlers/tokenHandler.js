// app/handlers/tokenHandler.js

(function() {

	exports = module.exports = function(User, logger, token, settings) {
	  	
		var authenticationErrorMsg	= 'Authentication error';
		var authenticationErrorCode	= 401;
		    
		//
		// Get a token.
		//
		function getTokenLogRequest(req, res, next) {
			logger.info(req.ip + ' ' + req.headers['user-agent'] + ' requested a token...');
			next();
		}

		function getTokenValidateRequest(req, res, next) {
			if (!req.headers.username || !req.headers.password) {
				// no username provided, or invalid GET request. For simplicity, just return a 401.
				logger.error(req.ip + ' ' + req.headers['user-agent'] + ' tried to log in, but username or password was not provided.');
				// send back 401
				return res.status(authenticationErrorCode).send(authenticationErrorMsg);
			}
			next();
		}

		function getTokenAuthenticateRequest(req, res, next) {
			// use our user model to find the user we want
			User.findOne({ username: req.headers.username }, function(err, user) {
				// fetch the appropriate user, if they exist
				if (err || !user) {
					// user cannot be found; may wish to log that fact here. For simplicity, just return a 401
					logger.error(req.ip + ' ' + req.headers['user-agent'] + ' tried to log in, but username ' + req.headers.username + ' was not found.');
					// send back 401
					return res.status(authenticationErrorCode).send(authenticationErrorMsg);
				}
				// compare hashed password to password sent over the request header
				User.comparePassword(user, req.headers.password, function(err, isMatch) {
					if (err) {
						// log error
						logger.error(req.ip + ' ' + req.headers['user-agent'] + ' tried to log in, but an error has occured.');	      		
	      				// an error has occured checking the password. For simplicity, just return a 401
	      				return res.status(authenticationErrorCode).send(authenticationErrorMsg);
	      			}
					  
					if (isMatch) {
						
						//
						// Great, user has successfully authenticated, so we can generate and send them a token.
						//
						
						// get token issuer
						var tokenIssuer = user.id;
						// get token expiration
						var tokenExpiration = token.getTokenExpiration(settings.tokenExpiresAfterHours);
						// get token secret
						var tokenSecret = settings.tokenSecret;
						
						// get issued token
						token.issueToken(tokenIssuer, tokenExpiration, tokenSecret, function(token) {
							// send back token, expiration and user
							res.json({
								token:		token,
								expires:	tokenExpiration,
								user:		{
									id:		user.id,
									name:	user.username
								}
							});
						});
												
					} else {
						// The password is wrong ...
						logger.error(req.ip + ' ' + req.headers['user-agent'] + ' with username ' + req.headers.username + ' tried to log in, but password was incorrect.');
						// send back 401
						return res.status(authenticationErrorCode).send(authenticationErrorMsg);
					}					
				});
			});
		}	
		
		//
		// Return handler.
		//
		return {
			getToken: [
				getTokenLogRequest,
				getTokenValidateRequest,
				getTokenAuthenticateRequest
			]
		};
	}

	/**
	 * Component annotations.
	 */
	exports['@require'] = [ 'user', 'logger', 'token', 'settings' ];
	
})();