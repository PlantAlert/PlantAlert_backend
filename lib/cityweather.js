app.get('/api/city/', function (req, res) {
  City.find({}, function (err, data) {
    if (err) return console.log('DB city get all city error.');
    var parsedData = JSON.parse(data.text);
    var cities = (cityParse.cityName);
    res.json(cityParse);
  })
});


// api string to splice
// 'api.openweathermap.org/data/2.5/forecast/daily?q=       Seattle,wa       &cnt=3&units=imperial&APIID=APIKEYHERE&mode=json'


var doIt = function(cities){
  var cityCall = []
  cities.forEach(function(city){

  app.get('/', function(req, res) {

      var cityUrl = 'api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&cnt=3&units=imperial&APIID=APIKEYHERE&mode=json';

  request
    .get(cityURL)
    .end (function(err, cityData) {

      if (err) console.log('there was an error');
      var tempParse = JSON.parse(cityData.text);
      var temp = res.json(tempParse.list[2].temp.night);
      return temp
    });
    if (temp < 32){
      cityCall.push(temp);
    }
  });
})
  return cityCall
}
