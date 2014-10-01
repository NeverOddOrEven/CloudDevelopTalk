'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var data = require('../../app/controllers/data');

	// Data Routes
	app.route('/data')
		.get(data.list)
		.post(users.requiresLogin, data.create);

	app.route('/data/:datumId')
		.get(data.read)
		.put(users.requiresLogin, data.hasAuthorization, data.update)
		.delete(users.requiresLogin, data.hasAuthorization, data.delete);

    // ChartsMeta Routes
	app.route('/datametadata')
		.get(data.listmeta);
  
  app.route('/datametadata/:datummetadataByID')
		.get(data.readmeta);
  
	// Finish by binding the Datum middleware
	app.param('datumId', data.datumByID);
  app.param('datummetadataByID', data.datummetadataByID);
};