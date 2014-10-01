'use strict';

angular.module('charts').directive('datasetSelect', [
	function() {
    function link(scope, element, attrs) {
      scope.setSelection = function(dataset) {
        scope.datasetSelection = dataset;
      };
      
      scope.isSelected = function(dataset) {
        return scope.datasetSelection === dataset;
      };
    }
    
		return {
			templateUrl: '/modules/charts/directives/templates/dataset-select.client.view.html',
			restrict: 'E',
      scope: {
        datasets: '=sets', // 'data-' prefix is stripped off the attribute name
        datasetSelection: '=setSelection'
      },
			link: link
		};
	}
]);