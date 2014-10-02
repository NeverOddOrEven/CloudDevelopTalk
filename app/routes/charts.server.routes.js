'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var charts = require('../../app/controllers/charts');

	// Charts Routes
	app.route('/charts')
		.get(charts.list)
		.post(users.requiresLogin, charts.create);

	app.route('/charts/:chartId')
		.get(charts.read)
		.delete(users.requiresLogin, charts.hasAuthorization, charts.delete);

	// Finish by binding the Chart middleware
	app.param('chartId', charts.chartByID);
};