/*jshint node: true */
'use strict';

var mongoose = require('mongoose');

var citySchema = mongoose.Schema({
  cityName: String, //example: Seattle,wa
  temperature: Number,
  lastPull: Date,
  users: []
});

module.exports = mongoose.model('City', citySchema);
