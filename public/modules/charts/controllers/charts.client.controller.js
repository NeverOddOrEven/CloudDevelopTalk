'use strict';

// Charts controller
angular.module('charts').controller('ChartsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Charts', 'DataMetadata',
	function($scope, $stateParams, $location, Authentication, Charts, DataMetadata) {
		$scope.authentication = Authentication;

    $scope.initializeNewChart = function() {
      $scope.datasets = DataMetadata.query();
    };
    
		// Create new Chart
		$scope.create = function() {
			// Create new Chart object
			var chart = new Charts ({
				name: this.name,
        datum: this.dataset._id,
        configuration: this.chartConfig,
        chartType: this.chartType
			});
      
      console.info(chart);

			// Redirect after save
			chart.$save(function(response) {
				$location.path('charts/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Chart
		$scope.remove = function( chart ) {
			if ( chart ) { chart.$remove();

				for (var i in $scope.charts ) {
					if ($scope.charts [i] === chart ) {
						$scope.charts.splice(i, 1);
					}
				}
			} else {
				$scope.chart.$remove(function() {
					$location.path('charts');
				});
			}
		};

		// Find a list of Charts
		$scope.find = function() {
			$scope.charts = Charts.query();
		};

		// Find existing Chart
		$scope.findOne = function() {
			$scope.chart = Charts.get({ 
				chartId: $stateParams.chartId
			});
		};
    
    $scope.yTickValues = function() {
      return [0, 5, 10, 15, 20, 25];
    };
    
    $scope.pieDimX = function() {
      return function(d) {
        return d.key;
      };
    };
    
    $scope.pieDimY = function() {
      return function(d) {
        return d.value;
      };
    };
    
    
	}
]);