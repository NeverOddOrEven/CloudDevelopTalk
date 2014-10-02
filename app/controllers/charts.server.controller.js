'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Chart = mongoose.model('Chart'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Chart already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Chart
 */
exports.create = function(req, res) {
	var chart = new Chart(req.body);
	chart.user = req.user;

	chart.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(chart);
		}
	});
};

/**
 * Show the current Chart
 */
exports.read = function(req, res) {
	res.jsonp(req.chart);
};

/**
 * Delete an Chart
 */
exports.delete = function(req, res) {
	var chart = req.chart ;

	chart.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(chart);
		}
	});
};

/**
 * List of Charts
 */
exports.list = function(req, res) { 
  Chart.find()
    .sort('-created').populate('user', 'displayName').exec(function(err, charts) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(charts);
      }
    });
};

/**
 * Chart middleware
 */
exports.chartByID = function(req, res, next, id) { 
  Chart.findById(id)
    .populate('user', 'displayName')
    .populate('datum')
    .exec(function(err, chart) {
      if (err) return next(err);
      if (! chart) return next(new Error('Failed to load Chart ' + id));
      req.chart = chart ;
      next();
    });
};

/**
 * Chart authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.chart.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};