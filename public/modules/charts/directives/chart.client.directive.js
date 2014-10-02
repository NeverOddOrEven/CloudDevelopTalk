'use strict';

angular.module('charts').directive('chart', [
	function() {
    function link(scope, element, attrs) {
      
    }
    
		return {
			templateUrl: '/modules/charts/directives/templates/chart.client.view.html',
			restrict: 'E',
      scope: {
        chartConfig: '=',
        chartData: '=',
        chartType: '='
      },
			link: link
		};
	}
]);