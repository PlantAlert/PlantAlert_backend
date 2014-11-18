//jshint node:true
'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('superagent');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {

  var openWeatherMapURL = 'api.openweathermap.org/data/2.5/forecast/daily?q=Seattle,wa&cnt=3&units=imperial&APIID=da612e4e7770055bad2a709b73e89893&mode=json'

  request
    .get(openWeatherMapURL)
    .end (function(err, openWeatherMapData) {

      if (err) console.log('there was an error');
      var tempParse = JSON.parse(openWeatherMapData.text);
      res.json(tempParse.list[2].temp.night);

   });
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server running on port: ' + app.get('port'));
});
