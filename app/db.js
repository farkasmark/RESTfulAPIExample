// app/db.js

(function() {
	
	var config	= require('../config/env/development');	// config file
	
	var driver	= require('mongoose');					// driver for MongoDB
	var _ = require('lodash');							// lodash
	
	var isConnected = false;
	
	module.exports = {
		// used to controll access to MongoDB database
		db: {
			// check if connected to database
			isConnected: function() {
				return isConnected;
			},
			// connect to database
			connect: function(callback) {
				if (!isConnected) {
					// connect to our MongoDB database 
					driver.connect(config.db.url, function(err) {
						if (err) {
							callback(err);
						} else {
							isConnected = true;
							callback(err);
						}
					});
				}
			},
			// create a database model
			model: function(name, schema) {
				
				// create a model object
				var Model = driver.model(name, new driver.Schema(schema));
				
				// expose data access layer functions	
				var DataAccessLayer = {
					// create an instance
					create: function (schema, callback) {
						// create a new instance of the model based on the schema
						var instance = new Model(schema);
						// save the instance
						instance.save(callback);
					},
					// find all instances
					find: function(callback) {
						Model.find(callback);
					},
					// find an instance by id
					findById: function(id, callback) {
						Model.findById(id, callback);
					},
					// update an instance by id
					update: function(id, schema, callback) {
						// use our model to find the instance we want
						Model.findById(id, function(err, instance) {
							// signal that instance with a given id was found
							callback.onFind(err);
							// update the instance according to schema
							_.assign(instance, schema);
							// save the bear
							instance.save(function(err) {
								// signal that instance was updated
								callback.onFinish(err, instance);
							});
						});				
					},
					// remove an instance by id
					remove: function(id, callback) {
						Model.remove({ _id: id }, callback);
					}
				};
				
				return DataAccessLayer;
			}
		}
	};
	
})();