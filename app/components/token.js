// app/components/token.js
"use strict";

(function() {
	
	var jwt		= require('jsonwebtoken');
	var moment	= require('moment'); 
	
	//
	// Initialize token issuer/validator.
 	//
	// This component issues/validates tokens.
	//
	exports = module.exports = {
		getTokenExpiration: function(expirationHours) {
			// get token expiration
			var expires = moment().add(expirationHours, 'h').valueOf();
			return expires;				
		},
		issueToken:	function(tokenIssuer, tokenExpiration, tokenSecret, tokenCallback) {
			// set token payload
			var tokenPayload = {
				iss: tokenIssuer,
				exp: tokenExpiration
			};
			// sign token
			jwt.sign(tokenPayload, tokenSecret, { algorithm: 'HS256' }, tokenCallback);
		},
		verifyToken: function(token, tokenSecret, tokenCallback) {
			// verify token
			jwt.verify(token, tokenSecret, function(err, tokenPayload) {
				// if token is invalid err is set and tokenPayload is undefined
				if (err) {
					tokenCallback(err);
					return;
				}
				// check token expiration ...
				if (tokenPayload.exp <= Date.now()) {
					// ... token is expired
					tokenCallback(new Error('Access token has expired'));
					return;
				}
				// ... token is NOT expired
				// call callback using token issuer from payload
				tokenCallback(null, tokenPayload.iss);
			});
		}
	};
	
	exports['@singleton'] = true;	
	
})();