'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Datum Schema
 */
var DatumSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Datum name',
		trim: true
	},
  data: {
    type: Schema.Types.Mixed
  },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Datum', DatumSchema);