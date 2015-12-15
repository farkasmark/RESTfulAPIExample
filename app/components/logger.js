// app/logger.js
// inspired by: https://auth0.com/blog/2015/09/04/an-introduction-to-microservices-part-1/
"use strict";

(function() {
		
	//
	// Logger class.
	//
	function Logger(logger) {
		
		this.stream = logger.stream;
		
		this.log = function(msg) {
			logger.log(msg);
		}
		
		this.info = function(msg) {
			logger.info(msg);
		}
		
		this.warn = function(msg) {
			logger.warn(msg);
		}
		
		this.error = function(msg) {
			logger.error(msg);
		}
	}

	Logger.prototype.constructor = Logger;
	
	//
	// WinstonLogger class.
	//
	function WinstonLogger() {
		
		// use winston library
		var winston = require('winston');
		
		// setup winston logger
		winston.emitErrs = true;
		var winstonLogger = new winston.Logger({
			transports: [
				new winston.transports.Console({
					timestamp: true,
					level: 'debug',
					handleExceptions: true,
					json: false,
					colorize: true
				})
			],
			exitOnError: false
		});
		
		winstonLogger.stream = {
			write: function(message, encoding){
				winstonLogger.debug(message.replace(/\n$/, ''));
			}
		};
		
		// call base constructor
		Logger.call(this, winstonLogger);
	}
	
	// Make our prototype from WinstonLogger.prototype so we inherit Logger's methods
	WinstonLogger.prototype = Object.create(Logger.prototype);
	WinstonLogger.prototype.constructor = WinstonLogger;
	
	//
	// Initialize logger.
 	//
	// This component initializes the application's logger.
	//
	exports = module.exports = function() {
		return new WinstonLogger();
	};
	
	exports['@singleton'] = true;
	
})();