'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Datum = mongoose.model('Datum'),
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
				message = 'Datum already exists';
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
 * Create a Datum
 */
exports.create = function(req, res) {
	var datum = new Datum(req.body);
	datum.user = req.user;

	datum.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(datum);
		}
	});
};

/**
 * Show the current Datum
 */
exports.read = function(req, res) {
	res.jsonp(req.datum);
};

/**
 * Show the current Datum
 */
exports.readmeta = function(req, res) {
  delete req.datum.data;
	res.jsonp(req.datum);
};

/**
 * Update a Datum
 */
exports.update = function(req, res) {
	var datum = req.datum ;

	datum = _.extend(datum , req.body);

	datum.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(datum);
		}
	});
};

/**
 * Delete an Datum
 */
exports.delete = function(req, res) {
	var datum = req.datum ;

	datum.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(datum);
		}
	});
};

/**
 * List of Data
 */
exports.list = function(req, res) { Datum.find().sort('-created').populate('user', 'displayName').exec(function(err, data) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(data);
		}
	});
};

/**
 * List of Data
 */
exports.listmeta = function(req, res) { 
  Datum.find()
    .sort('-created')
    .select('user name created')
    .slice('data', 1)
    .populate('user', 'displayName')
    .exec(function(err, data) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        var result = [];

        for (var i = 0; i < data.length; ++i) {
          // HAXX - Have to strip off mongoose non-enumerables
          var dataset = JSON.parse(JSON.stringify(data[i]));
          var columnCount = _.size(dataset.data[0]);
          _.extend(dataset, {'columnCount': columnCount});
          result.push(dataset);
        } 
        
        res.jsonp(result);
      }
    });
};

/**
 * Datum middleware
 */
exports.datumByID = function(req, res, next, id) { Datum.findById(id).populate('user', 'displayName').exec(function(err, datum) {
		if (err) return next(err);
		if (! datum) return next(new Error('Failed to load Datum ' + id));
		req.datum = datum ;
		next();
	});
};

exports.datummetadataByID = function(req, res, next, id) { 
  Datum.findById(id)
    .slice('data', 1)
    .populate('user', 'displayName')
    .exec(function(err, datum) {
      if (err) return next(err);
      if (! datum) return next(new Error('Failed to load Datum ' + id));
      req.datum = datum ;
      next();
    });
};

/**
 * Datum authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.datum.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};