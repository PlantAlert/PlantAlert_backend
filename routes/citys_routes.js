/*jshint node: true */
'use strict';

var City = require('../models/city');

module.exports = function(app) {
//the user is adding a new city. So, we add the user to the city if it exists; if not, make a new city and add the user to that city.
  app.post('/api/addcity', function(req, res) {
    var cityToAdd = req.body.city;
    var user = req.user;
    var cityCheck = City.find().where({cityName: cityToAdd});
    console.log(cityCheck);
    //Add user to city if city already exists
    if (cityCheck) {
      console.log('hi from existing city if block');
      city.save(function(err, data) {
        if (err) {
          console.log(err);
          return res.status(500).send('there was an error');
        }
        else {
          city.cityName = req.body.city;
          city.users.push(user._id);
          return res.status(200).send('Added ' + user.email + ' to '+ city.cityName);
        }
      });
    // var city = req.body;
    // delete note._id;
    // Note.findOneAndUpdate({_id: req.params.id}, note, function(err, data) {
    //   if (err) return res.status(500).send('there was an error');
    //   res.json(data);
    // });
    }
    //If the city isn't already in the collection, add it, then add the user
    else {
      console.log('hi from new city if block');
      var city = new City(req.body.city);
      city.save(function(err, data) {
        if (err) {
          return res.status(500).send('there was an error');
        }
        else {
        city.cityName = req.body.city;
        city.users.push(user._id);
        return res.status(200).send('Added new city ' + city.cityName + '; added ' + user.email + ' to city.');
        }
      });
    }
  });

  // app.post('/api/citys ', function(req, res) {
  //   var note = new Note(req.body);
  //   note.save(function(err, data) {
  //     if (err) return res.status(500).send('there was an error');
  //     res.json(data);
  //   });
  // });



  // app.get('/api/addcity', function(req ,res) {
  //   // console.log(req.user.basic.email);
  //   Note.find({}, function(err, data) {
  //     if (err) return res.status(500).send('there was an error');
  //     res.json(data);
  //   });
  // });

  // app.get('/api/citys/:id', function(req, res) {
  //   Note.findOne({_id: req.params.id}, function(err, data) {
  //     if (err) return res.status(500).send('there was an error');
  //     res.json(data);
  //   });
  // });

  // app.post('/api/citys ', function(req, res) {
  //   var note = new Note(req.body);
  //   note.save(function(err, data) {
  //     if (err) return res.status(500).send('there was an error');
  //     res.json(data);
  //   });
  // });

  // app.put('/api/citys/:id', function(req, res) {
  //   var note = req.body;
  //   delete note._id;
  //   Note.findOneAndUpdate({_id: req.params.id}, note, function(err, data) {
  //     if (err) return res.status(500).send('there was an error');
  //     res.json(data);
  //   });
  // });

  // app.delete('/api/citys /:id', function(req, res) {
  //   Note.remove({_id: req.params.id}, function(err) {
  //     if (err) return res.status(500).send('there was an error');
  //     res.json({msg: 'success!'});
  //   });
  // });
};
