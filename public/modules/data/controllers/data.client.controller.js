'use strict';

// Data controller
angular.module('data').controller('DataController', ['$scope', '$stateParams', '$location', 'Authentication', 'Data',
	function($scope, $stateParams, $location, Authentication, Data ) {
		$scope.authentication = Authentication;

    $scope.gridOptions = {};
    $scope.gridOptions.enableColumnResizing = true;
    
    $scope.createNewDatum = function() {
      $scope.gridOptions.data = 'myData';
      var lastCol = 0;
      
      // Start out with 1 row with only an ID field
      $scope.myData = [{id: 0}];
      $scope.gridOptions.columnDefs = [];
      
      $scope.gridOptions.onRegisterApi = function(gridApi){
         $scope.gridApi = gridApi;
      };
      
      $scope.addColumn = function() {
        var colName = 'col_' + (lastCol++);
        
        $scope.gridOptions.columnDefs.push({
          name: colName,
          enableCellEditOnFocus: true
        });
        
        var rowCount = $scope.myData.length;
        for (var i = 0; i < rowCount; ++i) {
          $scope.myData[i][colName] = '';
        }
        
        // haxxor - ui.grid is still in beta
        setTimeout(function() {
          $scope.gridApi.core.refresh();
        }, 100);
      };
      
      $scope.addRow = function() {
        var newRowIndex = $scope.myData.length;
        var newRow = {id: newRowIndex};
        
        for (var i = 0; i < lastCol; ++i) {
          var colName = 'col_' + i;
          newRow[colName] = '';
        }
        
        $scope.myData[newRowIndex] = newRow;
      };
    };
    
		// Create new Datum
		$scope.create = function() {
			// Create new Datum object
			var datum = new Data ({
				name: this.name,
        data: this.myData
			});

			// Redirect after save
			datum.$save(function(response) {
				$location.path('data/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Datum
		$scope.remove = function( datum ) {
			if ( datum ) { datum.$remove();

				for (var i in $scope.data ) {
					if ($scope.data [i] === datum ) {
						$scope.data.splice(i, 1);
					}
				}
			} else {
				$scope.datum.$remove(function() {
					$location.path('data');
				});
			}
		};

		// Update existing Datum
		$scope.update = function() {
			var datum = $scope.datum;

			datum.$update(function() {
				$location.path('data/' + datum._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Data
		$scope.find = function() {
			$scope.data = Data.query();
		};

		// Find existing Datum
		$scope.findOne = function() {
      $scope.gridOptions.data = 'datum.data';
			$scope.datum = Data.get({ 
				datumId: $stateParams.datumId
			});
		};
	}
]);