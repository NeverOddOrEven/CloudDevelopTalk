'use strict';

angular.module('charts').directive('chartType', [
	function() {
    function link(scope, element, attrs) {
      
      // Expose the selected chartType to the controller bound variable
      scope.chartTypeSelection = function(chartType) {
        scope.chartType = chartType;
      };
      
      scope.isSelected = function(chartSelected) {
        return chartSelected === scope.chartType;
      };
    }
    
    
		return {
			templateUrl: '/modules/charts/directives/templates/chart-type.client.view.html',
			restrict: 'E',
      scope: {
        chartType: '='
      },
			link: link
		};
	}
]);