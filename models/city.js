/*jshint node: true */
'use strict';

var express = require('express');
var mongoose = require('mongoose');
var request = require('superagent');
var bodyParser = require('body-parser');
var notify = require('../lib/notify');

var citySchema = mongoose.Schema({
  cityName: String, //example: Seattle,wa
  temperature: Number,
  lastPull: Date,
  users: []
});

citySchema.methods.pullCities = function(){
  this.model('City').find({}, function (err, data) {
    if (err) return console.log('DB city get all city error.');
    // var parsedData = JSON.parse(data.text);
    // var cities = (data[0].cityName);
    // console.log(data[0].cityName);

    // var cityCall = [];

      data.forEach(function(city){
        if(city.users !== null){
          var weatherForCity = function(city) {
            var tempParse;
            var temp;
            var cityUrl = 'api.openweathermap.org/data/2.5/forecast/daily?q=' + city.cityName + '&cnt=3&units=imperial&APIID=20e5bcdd87db0f48d21c0e8d85d30048&mode=json';
            console.log('STARTING REQUEST FOR ' + city.cityName);
            request
              .timeout(15000) //http://visionmedia.github.io/superagent/#get-requests
              .get(cityUrl)
              .end (function(err, cityData) {
                // console.log(cityData);
                if (err) console.log('there was an error');
                tempParse = JSON.parse(cityData.text);
                temp = (tempParse.list[2].temp.night);
                console.log(temp);
                if (temp <= 32){
                  notify(city);
                  // console.log(city);
                  console.log("it's freezing in " + city.cityName);
                }
              });
          };
        }
      weatherForCity(city);
      });
  });
};



module.exports = mongoose.model('City', citySchema);

