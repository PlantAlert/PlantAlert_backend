/*jshint node: true */
'use strict';

var mongoose = require('mongoose');

var citySchema = mongoose.Schema({
  cityName: String, //example: Seattle,wa
  temperature: Number,
  lastPull: Date,
  users: []
});

//add method to city object
//this sends a single notification to single id
// findOne to get city object. Has a callback that contains city object. That has devices in it.
//another function that

module.exports = mongoose.model('City', citySchema);
