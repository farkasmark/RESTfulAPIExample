// server.js
// inspired by: https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

(function() {

	var express			= require('express');			// use Express middleware
	var app				= express();					// create our app with Express middleware
	var bodyParser		= require('body-parser');
	var morgan			= require('morgan');			// use HTTP request logger middleware for node.js
	
	//
	// --- use express middlewares ---
	//
	
	// configure app to use bodyParser()
	// this will let us get the data from a POST
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	
	// use logger
	var logger			= require('./app/logging.js').logger;
	logger.info('Test log.');
	
	// configure app to use morgan
	// this will let us log the HTTP requests
	//app.use(
	//	// log HTTP requests
	//	morgan(':method :url :status :response-time ms - :res[content-length]', { 
	//		stream: logger.stream 
	//	})
	//);
	
	//
	// --- apply express routes ---
	//
	var routes = require('./app/routes');	// create a router
	
	var apiRouter = express.Router();		// get an instance of the express Router 
	routes.configure(app, apiRouter);		// configure our routes
	
	//
	// --- start express application ---
	//
	
	// config file
	var config = require('./config/env/development');
	
	// set our port
	var port = process.env.PORT || config.port;
	
	// startup our app at http://localhost:3000
	app.listen(port);
	
	// shoutout to the user                     
	logger.info('Magic happens on port ' + port);

})();