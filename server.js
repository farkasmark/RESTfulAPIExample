// server.js
// inspired by: https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

(function() {

	var express			= require('express');			// use Express middleware
	var app				= express();					// create our app with Express middleware
	var bodyParser		= require('body-parser');
	var morgan			= require('morgan');			// use HTTP request logger middleware for node.js
	
	//
	// --- use IoC pattern ---
	//
	
	var IoC	= require('electrolyte');
	
	IoC.use(IoC.node('app'));
	IoC.use(IoC.node('app/components'));
	IoC.use(IoC.node('app/models'));
	IoC.use(IoC.node('app/handlers'));
	IoC.use(IoC.node('config'));
	
	//
	// --- use express middlewares ---
	//
	
	// configure app to use bodyParser()
	// this will let us get the data from a POST
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	
	// use logger
	var logger = IoC.create('logger');
	
	// configure app to use morgan
	// this will let us log the HTTP requests
	app.use(
		// log HTTP requests
		morgan(':method :url :status :response-time ms - :res[content-length]', { 
			stream: logger.stream 
		})
	);
	
	//
	// --- apply express routes ---
	//
		
	// configure routes
	var router = express.Router();
	var routes = IoC.create('routes');
	routes.configure(router);
	// all of our routes will be prefixed with /api
	app.use('/api', router);
	
	//
	// --- start express application ---
	//
	
	// config file
	var settings = IoC.create('settings');
	
	// set our port
	var port = process.env.PORT || settings.port;
	
	// startup our app at http://localhost:3000
	app.listen(port);
	
	// shoutout to the user                     
	logger.info('Magic happens on port ' + port);

})();