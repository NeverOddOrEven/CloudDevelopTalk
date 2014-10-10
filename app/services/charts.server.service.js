'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Datum = mongoose.model('Datum'),
	_ = require('lodash');

function getPieChartData(datumId, configuration) {
	var dataPromise = Datum.findById(datumId).exec()
    .then(function(datum) {
      if (!datum)
        throw new Error('Failed to load Datum');
      return datum;
    }).then(function(datum) {
      /*
      [ [ 'A', 'A' ],
        [ 'A', 'B' ],
        [ 'A', 'B' ],
        [ 'A', 'B' ],
        [ 'A', 'C' ],
        [ 'B', 'A' ],
        [ 'B', 'B' ],
        [ 'B', 'B' ],
        [ 'B', 'B' ],
        [ 'B', 'C' ] ]
      
        Would yield:
        AA: 10%
        AB: 30%
        AC: 10%
        BA: 10%
        BB: 30%
        BC: 10%
        
        Needs to support m x n matrix
        
      */
      
      /*jshint loopfunc: true */
      // Iterate over the columns: col_0, col_1, ..., col_n
      var keys = [], values = [], currentColumnIndex = 0;
      _.forEach(configuration.dimensions.d1, function(col) {
        // iterate over the data rows 0, 1, ..., n
        for(var i = 0; i < datum.data.length; ++i) {
          // Only get the numeric values one time (no need to repeat our work)
          if (currentColumnIndex === 0) {
              // If D2 is specified, pull that value - if not, count it 1 time
              var hasD2 = configuration.dimensions.d2.length > 0;
              var valueColumnKey = hasD2 ? configuration.dimensions.d2[0] : '';
              var value = hasD2 ? datum.data[i][valueColumnKey] : 1;
              value = (_.isNumber(value) && !_.isNaN(value)) ? value : 1; // Enforce numeric
              values[i] = value;
          }
          
          var currentKey = keys[i] ? keys[i] : '';
          keys[i] = currentKey + datum.data[i][col];
        }
        ++currentColumnIndex;
      });
      
      if (keys.length !== values.length)
        throw new Error('The data is broken. More keys than values in dataset.');
      
      // post process our data - essentially this is the group by step
      var groupedData = [];
      for (var i = 0; i < keys.length; ++i) {
        var currentValue = values[i];
        var groupedDataKey = keys[i];
        var groupedDataValue = groupedData[groupedDataKey] ? groupedData[groupedDataKey] : 0;
        groupedData[groupedDataKey] = groupedDataValue + currentValue;
      }

      var chartData = [];
      for (var key in groupedData) {
        chartData.push({key: key, value: groupedData[key]});
      }
      
      console.info(chartData);
      return chartData;
    });
  
    return dataPromise;
}

function getLineChartData(datumId, configuration) {
		var dataPromise = Datum.findById(datumId).exec()
    .then(function(datum) {
      if (!datum)
        throw new Error('Failed to load Datum');
      return datum;
    }).then(function(datum) {
      var lineChartData = [];
      
      var d1 = datum.data.map(function(row) {
        return row[configuration.dimensions.d1[0]];
      });
      
      /*jshint loopfunc: true */
      for (var i = 0; i < configuration.dimensions.d2.length; ++i) {
        var d2 = datum.data.map(function(row) {
          return row[configuration.dimensions.d2[i]];
        });
        
        lineChartData.push({key: configuration.dimensions.d2[i], values: _.zip(d1, d2)});
      }
      /*jshint loopfunc: false */

      return lineChartData;
    });
  
    return dataPromise;
}

function getBarChartData(datumId, configuration) {
	var message = '';
}

// Returns a promise or {}
function getChartData(datumId, configuration) {
  if (!datumId) {
    console.error('No datum id was passed into the method');
    return {};
  }
  
  // Change the charts to be polymorphic later...
  if (configuration.chartType === 'bar') {
    return getBarChartData(datumId, configuration);
  } else if (configuration.chartType === 'line') {
    return getLineChartData(datumId, configuration);
  } else if (configuration.chartType === 'pie') {
    return getPieChartData(datumId, configuration);
  } else {
    console.error('Server is not configured to return data for this chartType: ' + configuration.chartType);
    return {};
  }
}

exports.getChartData = getChartData;
exports.getPieChartData = getPieChartData;
exports.getLineChartData = getLineChartData;
exports.getBarChartData = getBarChartData;