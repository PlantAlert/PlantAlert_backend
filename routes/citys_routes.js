/*jshint node: true */
'use strict';

var City = require('../models/city');

module.exports = function(app) {
//the user is adding a new city. So, we add the user to the city if it exists; if not, make a new city and add the user to that city.

  //delete this get route when we get everything working
  app.get('/api/citys', function(req, res) {
    res.send({msg: 'hello from the get route'});
  });

  app.post('/api/addcity', function(req, res) {
    var cityToAdd;
    var user = req.user;

//start bug fixing here: even an empty object will return truthy. cityCheck will always return truthy. We need something that will return false if there are no cities found in the database that match the inputed city name.
    // var cityCheck = City.find().where({cityName: cityToAdd});
// return res.send(typeof cityCheck);


    // Add user to city if city already exists

    // if (cityCheck) {
    //   console.log('hi from existing city if block');
    //   city.save(function(err, data) {
    //     if (err) {
    //       console.log(err);
    //       return res.status(500).send('there was an error');
    //     }
    //     else {
    //       city.cityName = req.body.city;
    //       city.users.push(user._id);
    //       return res.status(200).send('Added ' + user.email + ' to '+ city.cityName);
    //     }
    //   });
    // }

      //================
     //WE MIGHT HAVE TO USE CODE LIKE THIS TO UPDATE THE CITY RECORD. TYLER USED IT IN THE NOTES APP TO UPDATE A NOTE'S TEXT.
    // var city = req.body;
    // delete note._id;
    // Note.findOneAndUpdate({_id: req.params.id}, note, function(err, data) {
    //   if (err) return res.status(500).send('there was an error');
    //   res.json(data);
    // });
    //===================

    // If the city isn't already in the collection, add it, then add the user

  //   else {

      var city = new City(cityToAdd);
      city.cityName = cityToAdd;
      city.users.push(user._id);
      city.save(function(err, data) {
        if (err) {
          return res.status(500).send('there was an error');
        }
        else {


        return res.status(200).json(data);
        // return res.status(200).send('Added new city ' + city.cityName + '; added ' + user.email + ' to city.');
        }
      });
  //   }
  });
};


//CODE FROM NOTES APP
//===================

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
