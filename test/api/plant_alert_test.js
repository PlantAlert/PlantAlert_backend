/*jshint node: true */
'use strict';

//Many thanks to Charles Renwick for help with the testing code.

process.env.MONGO_URL = 'mongodb://localhost/city_development';
var chai = require('chai');
var chaihttp = require('chai-http');
var sinon = require('sinon');
chai.use(chaihttp);


require('../../server');
var City = require('../../models/city');
var notify = require('../../lib/notify');

var expect = chai.expect;

describe('user crud', function() {
  var jwtToken;
  it('should be able to create a new user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test@example.com', password: 'Password123#'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should not let a user have a password less than 8 characters long', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test2@example.com', password: 'testnow', deviceToken: 'teststringofdeviceToken'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('invalid password');
      done();
    });
  });

});


describe('city crud', function() {
  var jwtToken;
  var jwtToken2;

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test1@example.com', password: 'Password123#', deviceToken: 'teststringofdeviceToken'})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test2@example.com', password: 'Password123#', deviceToken: 'teststringofdeviceToken'})
    .end(function (err, res) {
      jwtToken2 = res.body.jwt;
      done();
    });
  });

    it('should add a new city, then add the user deviceToken to that new city', function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken})
    .send({cityName: 'Kona, HI'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('cityName');
      expect(res.body.cityName).to.eql('Kona,hi');   // Tests cityNameConversion.js
      expect(res.body.users).to.not.eql([]);
      done();
    });
  });

  it('should add a user to an existing city', function(done) {
    this.timeout(5000);
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken2})
    .send({cityName: 'Kona, HI'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.users.length).to.eql(2);
      done();
    });
  });

  it('should delete a user from an existing city', function(done) {
    this.timeout(5000);
    chai.request('http://localhost:3000')
    .post('/v1/api/deletecity')
    .set({'jwt': jwtToken2})
    .send({cityName: 'Kona, HI'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.users.length).to.eql(1);
      done();
    });
  });
});

describe('weather check', function() {
  var jwtToken3;
  var jwtToken4;
  var jwtToken5;
  var city;
  var mock;

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test3@example.com', password: 'Password123#', deviceToken: 'teststringofdeviceToken3'})
    .end(function (err, res) {
      jwtToken3 = res.body.jwt;
      done();
    });
  });

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test4@example.com', password: 'Password123#', deviceToken: 'teststringofdeviceToken4'})
    .end(function (err, res) {
      jwtToken4 = res.body.jwt;
      done();
    });
  });

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test5@example.com', password: 'Password123#', deviceToken: 'teststringofdeviceToken5'})
    .end(function (err, res) {
      jwtToken5 = res.body.jwt;
      done();
    });
  });

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken3})
    .send({cityName: 'Kona, HI'})
    .end(function(err, res) {
      done();
    });
  });

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken4})
    .send({cityName: 'Kona, HI'})
    .end(function(err, res) {
      done();
    });
  });

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken3})
    .send({cityName: 'Barrow, AK'})
    .end(function(err, res) {
      done();
    });
  });

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken5})
    .send({cityName: 'Barrow, AK'})
    .end(function(err, res) {
      done();
    });
  });

  before(function() {
    city = new City();
    mock = sinon.mock(city);
  })

  it('the notify function should get called once for Barrow,ak by the pullCities method', function(done) {
    mock.expects('notifyFreezing').once();
    city.pullCities(function() {
      done();
    });

  });

  after(function() {
    mock.verify();
    mock.restore();
  });

   // var city = new City();
    // var spy = sinon.spy(notify);

    // city.pullCities();

    // expect(spy.called).to.eql(true);
    // expect(spy.callCount).to.eql(1)

    // spy.restore();

  // it('should call dailyAPICall once a day', function() {

  //   var clock = sinon.useFakeTimers();

  //   //put a wrapper function around the setTimeout function
  //   //call that wrapper function
  //   //fast-forward one day
  //   //expect dailyApiCall to be called

  //   clock.tick(86400000);
  //   mock.expects('notify').once()
  // });
});



  // it('pullCities should find the cities', function() {
  //   var spy = sinon.spy(citySchema, 'pullCities');

  //   sinon.assert(spy.returned('Seattle,wa'));
  //   sinon.assert(spy.returned('Barrow,ak'));

  //   citySchema.pullCities.restore();
  // });

//   it('pullCities should make a call to the weather api for each city', function() {
//     var spy = sinon.spy(weatherForCity);


//     expect(spy.calledTwice());
// // //level 2- did getWeather return Barrow,ak in cityCall
// //     assert(spy.returned('Barrow,ak'));
// // level 3 - was the stuff in the forEach function into its own method. Track whether that got called with Seattle,wa and Barrow,ak. --> separate test

//     weatherForCity.restore();
//   });

//   it('pullCities should return those cities where the temp 3 days from now is 32F or below', function() {
//     var spy = sinon.spy(notify);
//     expect(spy.calledOnce());
//     // expect(spy.returned('Barrow,ak'));
//     notify.restore();
//   });
// });
