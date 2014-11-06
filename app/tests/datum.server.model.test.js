'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Chart = mongoose.model('Chart'),
	Datum = mongoose.model('Datum');

/**
 * Globals
 */
var chart, datum;

// Test the grouping mechanism