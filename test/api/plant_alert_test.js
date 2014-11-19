/*jshint node: true */
'use strict';

//Many thanks to Charles Renwick for help with the testing code.

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
var sinon = require('sinon');
chai.use(chaihttp);


require('../../server');

var expect = chai.expect;

describe('user crud', function() {
  var id;
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

  it('should not let a user have a password without a number', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test2@example.com', password: 'testtestT$', deviceID: 'teststringofdeviceid'})
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
    .send({email: 'test7@example.com', password: 'Password123#', deviceID: 'teststringofdeviceid'})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test8@example.com', password: 'Password123#', deviceID: 'teststringofdeviceid2'})
    .end(function (err, res) {
      jwtToken2 = res.body.jwt;
      done();
    });
  });

    it('should add a new city, then add the user deviceID to that new city', function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken})
    .send({cityName: 'Seattle,wa'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('cityName');
      expect(res.body.users).to.not.eql([]);
      done();
    });
  });

  it('should add a user to an existing city', function(done) {
    this.timeout(5000);
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken2})
    .send({cityName: 'Seattle,wa'})
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
    .send({cityName: 'Seattle,wa'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.users.length).to.eql(1);
      done();
    });
  });

  // it('should delete the city if there are no users associated with it', function(done) {
  //   this.timeout(5000);
  //   chai.request('http://localhost:3000')
  //   .post('/v1/api/deletecity')
  //   .set({'jwt': jwtToken})
  //   .send({cityName: 'Seattle,wa'})
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     console.log(res.status);
  //     console.log(res.body);
  //     expect(res.body.msg).to.eql('deleted Seattle,wa');
  //     done();
  //   });
  // });

});

describe('weather check', function() {
  var jwtToken;
  var jwtToken2;

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test7@example.com', password: 'Password123#', deviceID: 'teststringofdeviceid'})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test8@example.com', password: 'Password123#', deviceID: 'teststringofdeviceid2'})
    .end(function (err, res) {
      jwtToken2 = res.body.jwt;
      done();
    });
  });

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken})
    .send({cityName: 'Seattle, WA'})
    .end(function(err, res) {
      done();
    });
  });

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken2})
    .send({cityName: 'Seattle, WA'})
    .end(function(err, res) {
      done();
    });
  });

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/addcity')
    .set({'jwt': jwtToken2})
    .send({cityName: 'Barrow, AK'})
    .end(function(err, res) {
      done();
    });
  });

  // it('pullCities should find the cities', function() {
  //   var spy = sinon.spy(citySchema, 'pullCities');

  //   sinon.assert(spy.returned('Seattle,wa'));
  //   sinon.assert(spy.returned('Barrow,ak'));

  //   citySchema.pullCities.restore();
  // });

  // it('pullCities should make a call to the weather api for each city', function() {
  //   var spy = sinon.spy(citySchema, 'getWeather');

//level 1 - was getWeather called once
    // assert(spy.calledOnce());
// //level 2- did getWeather return Barrow,ak in cityCall
//     assert(spy.returned('Barrow,ak'));
//level 3 - was the stuff in the forEach function into its own method. Track whether that got called with Seattle,wa and Barrow,ak. --> separate test

  //   citySchema.getWeather.restore();
  // });

  it('pullCities should return those cities where the temp 3 days from now is 32F or below', function() {
    var spy = sinon.spy(notify);
    expect(spy.calledOnce());
    // expect(spy.returned('Barrow,ak'));
    notify.restore();
  });
});
