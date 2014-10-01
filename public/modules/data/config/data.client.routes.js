'use strict';

//Setting up route
angular.module('data').config(['$stateProvider',
	function($stateProvider) {
		// Data state routing
		$stateProvider.
		state('listData', {
			url: '/data',
			templateUrl: 'modules/data/views/list-data.client.view.html'
		}).
		state('createDatum', {
			url: '/data/create',
			templateUrl: 'modules/data/views/create-datum.client.view.html'
		}).
		state('viewDatum', {
			url: '/data/:datumId',
			templateUrl: 'modules/data/views/view-datum.client.view.html'
		}).
		state('editDatum', {
			url: '/data/:datumId/edit',
			templateUrl: 'modules/data/views/edit-datum.client.view.html'
		});
	}
]);