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
        return new Error('Failed to load Datum');
      console.log('returning data');
      return datum;
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
      
      var d1 = datum.data.map(function(datum) {
        return datum[configuration.dimensions.d1[0]];
      });
      
      /*jshint loopfunc: true */
      for (var i = 0; i < configuration.dimensions.d2.length; ++i) {
        var d2 = datum.data.map(function(datum) {
          return datum[configuration.dimensions.d2[i]];
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