'use strict';

angular.module('charts').directive('configureChart', [
	function() {
    function link(scope, element, attrs) {
      scope.getColumns = function() {
        var columns = [];
        for (var key in scope.dataset.data[0]) {
          columns.push(key);
        }
        return columns;
      };
    }
    
		return {
			templateUrl: '/modules/charts/directives/templates/configure-chart.client.view.html',
			restrict: 'E',
      scope: {
        chartType: '=',
        dataset: '=set' // Because "data-" gets stripped off "data-set" attribute 
      },
			link: link
		};
	}
]);