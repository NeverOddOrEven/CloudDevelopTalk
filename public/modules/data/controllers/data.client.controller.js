'use strict';

// Data controller
angular.module('data').controller('DataController', ['$scope', '$stateParams', '$location', 'Authentication', 'Data',
	function($scope, $stateParams, $location, Authentication, Data ) {
		var DEFAULT_TEXT = '';
    var DEFAULT_NUM = 0;
    
    $scope.authentication = Authentication;
    
    $scope.gridOptions = {};
    

    $scope.createNewDatum = function() {
      $scope.gridOptions = {};
      $scope.gridOptions.enableColumnResizing = true;
      $scope.gridOptions.data = 'myData';
      $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
      };
      
      var columnDefinitions = [];
      
      // Start out with 1 row with only an ID field (1 column)
      $scope.myData = [];
      $scope.gridOptions.columnDefs = [{name: 'id'}];
      
      // Refactor to support dates too
      function addColumn(isNumeric) {
        var colName = 'col_' + ($scope.gridOptions.columnDefs.length);
        
        $scope.gridOptions.columnDefs.push({
          name: colName,
          enableCellEditOnFocus: true,
          type: isNumeric ? 'number' : 'string'
        });
        
        var rowCount = $scope.myData.length;
        for (var i = 0; i < rowCount; ++i) {
          $scope.myData[i][colName] = isNumeric ? DEFAULT_NUM : DEFAULT_TEXT;
        }
      }
      
      $scope.addTextColumn = function() {
        addColumn(false);
      };
      
      $scope.addNumericColumn = function() {
        addColumn(true);
      };
      
      $scope.addRow = function() {
        
        // Get all current indices
        var indices = $scope.myData.map(function(row) {
          return row.id;
        });
        
        console.log(indices);
        // Find the next index
        var nextIndex = $scope.myData.length;
        while (indices.indexOf(nextIndex) !== -1) {
          nextIndex++;
        } 
        console.log(nextIndex);
        var newRow = {id: nextIndex};
        
        // Start at index 1 to avoid the id column
        for (var i = 1; i < $scope.gridOptions.columnDefs.length; ++i) {
          var colName = 'col_' + i;
          var colValue = $scope.gridOptions.columnDefs[i].type === 'number' ? DEFAULT_NUM : DEFAULT_TEXT;
          newRow[colName] = colValue;
        }
        
        $scope.myData.push(newRow);
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
    
    // Find existing Chart
		$scope.findOne = function() {
			$scope.datum = Data.get({ 
				datumId: $stateParams.datumId
			});
      
      // Wire up the grid
      $scope.gridOptions = {};
      $scope.gridOptions.enableColumnResizing = true;
      $scope.gridOptions.data = 'datum.data';
      $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
      };
		};
	}
]);