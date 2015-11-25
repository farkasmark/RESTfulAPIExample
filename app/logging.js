// app/logger.js
// inspired by: https://auth0.com/blog/2015/09/04/an-introduction-to-microservices-part-1/

(function() {
	
	// use winston library
	var winston = require('winston');
	
	// logging
	winston.emitErrs = true;
	var logger = new winston.Logger({
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
	
	logger.stream = {
		write: function(message, encoding){
			logger.debug(message.replace(/\n$/, ''));
		}
	};
	
	/**
	 * Logger base class.
	 */
	function BaseLogger() {
	}
	
	BaseLogger.prototype.log = function(msg) {
		console.log(msg);
	}
	
	BaseLogger.prototype.info = function(msg) {
		console.info(msg);
	}
	
	BaseLogger.prototype.warn = function(msg) {
		console.warn(msg);
	}
	
	BaseLogger.prototype.error = function(msg) {
		console.error(msg);
	}
	
	BaseLogger.prototype.constructor = BaseLogger;	
	
	/**
	 * WinstonLogger class.
	 */
	function WinstonLogger() {
	}
	
	// Make our prototype from WinstonLogger.prototype so we inherit Logger's methods
	WinstonLogger.prototype = Object.create(BaseLogger.prototype);
	
	// Override Logger's log
	WinstonLogger.prototype.log = function(msg) {
		console.log(msg);
	}
	
	// Override Logger's info
	WinstonLogger.prototype.info = function(msg) {
		console.info(msg);
	}
	
	// Override Logger's warn
	WinstonLogger.prototype.warn = function(msg) {
		console.warn(msg);
	}
	
	// Override Logger's error
	WinstonLogger.prototype.error = function(msg) {
		console.error(msg);
	}
	
	WinstonLogger.prototype.constructor = WinstonLogger;	
	
	var standardLogger = new BaseLogger();
	
	/**
	 * Initialize logger.
 	 *
	 * This component initializes the application's logger.
	 */
	module.exports = function() {
		logger: logger
	};
	
})();