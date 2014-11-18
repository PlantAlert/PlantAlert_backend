/*jshint node: true */
'use strict';

//Many thanks to Charles Renwick for help with the testing code.

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);


require('../../server');

var expect = chai.expect;

describe('user functionality', function() {
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

//   // it('should not allow a logged-in user access after 24 hours', function(done) {
//   //   chai.request('http://localhost:3000')
//   //   .get('/api/notes')
//   //   .end(function(err, res) {
//   //     expect(err).to.eql(null);
//   //     expect(res.body.msg).to.eql('Session expired. Please log in again.');
//   //     done();
//   //   });
//   // });
});

describe('user password tests', function() {
  it('should not let a user have a password without a number', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test2@example.com', password: 'testtestT$'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('invalid password');
      done();
    });
  });
});


describe('basic notes crud', function() {
  var id;
  var jwtToken;

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test7@example.com', password: 'Password123#'})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should add a new city, then add the user to that new city', function(done) {
    this.timeout(5000);
    chai.request('http://localhost:3000')
    .post('/api/addcity')
    .set({'jwt': jwtToken})
    .send({city: 'Seattle,wa'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      console.log(res.status);
      // expect(res.body).to.have.property('_id')
      // id = res.body._id;
      expect(res.text).to.eql('Added test7@example.com to Seattle,wa.');
      done();
    });
  });

  it('should add a user to an existing city', function(done) {
    this.timeout(5000);
    chai.request('http://localhost:3000')
    .post('/api/addcity')
    .set({'jwt': jwtToken})
    .send({city: 'Seattle,wa'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      // console.log(res.body);
      // expect(res.body).to.have.property('_id')
      // id = res.body._id;
      expect(res.text).to.eql('Added new city Seattle,wa; added test7@example.com to city.');
      done();
    });
  });

    // console.log('JWT in get index ' + jwtToken)
  // it('should be able to get an index', function(done) {
  //   chai.request('http://localhost:3000')
  //   .get('/v1/api/notes')
  //   .set({jwt: jwtToken})
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     expect(Array.isArray(res.body)).to.be.true;
  //     done();
  //   });
  // });

  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    .get('/v1/api/notes/' + id)
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    .put('/v1/api/notes/' + id)
    .set({jwt: jwtToken})
    .send({noteBody: 'new note body'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note body');
      done();
    });
  });

});
