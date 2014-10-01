'use strict';

angular.module('core').directive('fiveNumberSummary', [
	function() {
    function link(scope, element, attrs) {
      var fiveNumberSummary = scope.fiveNumberSummary || {};

      // If the data is not set assign default values
      scope.min = fiveNumberSummary.min || 'n/a';
      scope.max = fiveNumberSummary.max || 'n/a';
      scope.median = fiveNumberSummary.median || 'n/a';
      scope.q1 = fiveNumberSummary.q1 || 'n/a';
      scope.q3 = fiveNumberSummary.q3 || 'n/a';
    }
    
		return {
			templateUrl: '/modules/core/directives/templates/five-number-summary.client.view.html',
			restrict: 'E',
      scope: {
        fiveNumberSummary:'=summaryData'
      },
			link: link
		};
	}
]);