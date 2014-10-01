'use strict';

//Data service used to communicate Data REST endpoints
angular.module('data').factory('Data', ['$resource',
	function($resource) {
		return $resource('data/:datumId', { datumId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);