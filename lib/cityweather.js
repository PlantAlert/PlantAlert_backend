//jshint node:true

















// 'use strict';
// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// // var request = require('superagent');

// var City = require('../models/city')

// app.use(express.static(__dirname + '/public'));
// // app.use(bodyParser.urlencoded({ extended: true }));
// console.log('we get here');
// app.get('/api/cities/', function (req, res) {
//   City.find({"cityName": { $exists: true }}).find(function (err, data) {
//     if (err) return console.log('DB city get all city error.'); console.log('we get here');
//     var parsedData = JSON.parse(data.text);
//     var cities = (cityParse.cityName);
//     res.json(cityParse);
//   });
// });
// console.log('heyya')

// api string to splice
// 'api.openweathermap.org/data/2.5/forecast/daily?q=       Seattle,wa       &cnt=3&units=imperial&APIID=APIKEYHERE&mode=json'


// var doIt = function(cities){
//   var cityCall = [];
//   cities.forEach(function(city){

//   app.post('/', function(req, res) {

//     var cityUrl = 'api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&cnt=3&units=imperial&APIID=20e5bcdd87db0f48d21c0e8d85d30048&mode=json';

//   request
//     .get(cityURL)
//     .end (function(err, cityData) {

//       if (err) console.log('there was an error');
//       var tempParse = JSON.parse(cityData.text);
//       var temp = res.json(tempParse.list[2].temp.night);
//       return temp;
//     });
//     if (temp < 32){
//       cityCall.push(temp);
//     }
//   });
// });
//   return cityCall;
// };

// app.set('port', process.env.PORT || 3000);
// app.listen(app.get('port'), function() {
//   console.log('server running on port: ' + app.get('port'));
// });
