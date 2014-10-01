'use strict';

//Data service used to communicate Charts REST endpoints
angular.module('charts').factory('DataMetadata', ['$resource',
	function($resource) {
		return $resource('datametadata/:datummetadataId', { datummetadataId: '@_id'
		});
	}
]);