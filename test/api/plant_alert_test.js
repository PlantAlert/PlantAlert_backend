/*jshint node: true */
'use strict';

//Many thanks to Charles Renwick for help with the testing code.

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
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
