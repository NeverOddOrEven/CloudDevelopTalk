'use strict';

angular.module('charts').directive('configureChart', [
	function() {
    function link(scope, element, attrs) {
      // Dimensions one and two - hold references to columns
      scope.chartConfig = {
        d1: [],
        d2: []
      };
    
      // If the dataset changes, that means column selections need to be cleared
      scope.$watch('dataset', function() {
        scope.resetD1();
        scope.resetD2();
      });
      
      scope.getColumns = function() {
        var columns = [];
        for (var key in scope.dataset.data[0]) {
          if (scope.chartConfig.d1.indexOf(key) === -1 && scope.chartConfig.d2.indexOf(key) === -1)
            columns.push(key);
        }
        return columns;
      };
      
      scope.resetD1 = function() {
        scope.chartConfig.d1 = [];
      };
      
      scope.resetD2 = function() {
        scope.chartConfig.d2 = [];
      };
      
      scope.setD1 = function(index) {
        var value = scope.getColumns()[index];
        scope.resetD1();
        scope.chartConfig.d1.push(value);
      };
      
      scope.setD2 = function(index) {
        var value = scope.getColumns()[index];
        scope.resetD2();
        scope.chartConfig.d2.push(value);
      };
      
      scope.pushD1 = function(index) {
        scope.chartConfig.d1.push(scope.getColumns()[index]);
      };
      
      scope.pushD2 = function(index) {
        scope.chartConfig.d2.push(scope.getColumns()[index]);
      };
    }
    
		return {
			templateUrl: '/modules/charts/directives/templates/configure-chart.client.view.html',
			restrict: 'E',
      scope: {
        chartType: '=',
        dataset: '=set', // Because "data-" gets stripped off "data-set" attribute 
        chartConfig: '='
      },
			link: link
		};
	}
]);