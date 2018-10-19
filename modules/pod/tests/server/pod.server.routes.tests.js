'use strict';

/**
 * Module Dependencies
 */
var should = require('should');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Pod = mongoose.model('Pod');
var express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app;
var agent;
var credentials;
var user;
var pod;

/**
 * Pod Routes Tests
 */
describe('Pod CRUD Tests', function () {
  before(function (done) {
    // Get the application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'P@$$w0rd!!'
    };

    // Create a new User
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create a new pod
    user.save()
      .then(function () {
        pod = {
          firstName: 'First',
          lastName: 'Last',
          age: 30,
          gender: 'Male',
          description: 'Description about myself',
          phone: {
            house: '0161000000',
            mobile: '07777777777'
          },
          history: ['history1', 'history2', 'history3'],
          username: 'First Last',
          address: {
            line1: 'Line 1',
            line2: 'Line 2',
            line3: 'Line 3',
            postcode: 'postcode',
            county: 'county',
            city: 'city'
          },
          information: {
            skills: ['Photoshop', 'JavaScript', 'HTML5', 'CSS3', 'MEAN', 'Angular'],
            credits: 'Credits from previous employers',
            currentlyEmployed: false,
            workHistory: {
              company1: {
                companyName: 'company1',
                timeWorked: '1 Year',
                jobTitle: 'job title 1',
                jobDescription: 'job description 1',
                address: {
                  line1: 'line1',
                  line2: 'line2',
                  line3: 'line3',
                  postcode: 'postcode',
                  county: 'county',
                  city: 'city'
                }
              },
              company2: {
                companyName: 'company2',
                timeWorked: '4 years',
                jobTitle: 'job title 2',
                jobDescription: 'job description 2',
                address: {
                  line1: 'line1',
                  line2: 'line2',
                  line3: 'line3',
                  postcode: 'postcode',
                  county: 'county',
                  city: 'city'
                }
              },
              company3: {
                companyName: 'company3',
                timeWorked: '2 Years 3 Months',
                jobTitle: 'job title 3',
                jobDescription: 'job description 3',
                address: {
                  line1: 'line1',
                  line2: 'line2',
                  line3: 'line3',
                  postcode: 'postcode',
                  county: 'county',
                  city: 'city'
                }
              },
              podHistory: {
                jobCounter: 4,
                hoursCounter: 23
              },
              preferences: {
                distanceWillingToTravel: '5 Miles',
                preferredTimes: '9 - 5',
                preferredDays: 'Mon - Fri'
              }
            },
            qulifications: {
              name: 'Name',
              level: 'None',
              dateObtained: 'Some Date',
              locationObtained: 'Location Obtained'
            }
          }
        };
        done();
      })
      .catch(done);
  });

  it('should not be able to save a pod if logged in without the admin role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        agent.post('/api/pods')
          .send(pod)
          .expect(403)
          .end(function (podSaveErr, podSaveRes) {
            // Call the assertion callback
            done(podSaveErr);
          });
      });
  });

  it('should not be able to save a pod if not logged in', function (done) {
    agent.post('/api/pods')
      .send(pod)
      .expect(403)
      .end(function (podSaveErr, podSaveRes) {
        // Save the assertion callback
        done(podSaveErr);
      });
  });

  it('should not be able to update a pod if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        agent.post('/api/pods')
          .send(pod)
          .expect(403)
          .end(function (podSaveErr, podSaveRes) {
            // Call the assertion callback
            done(podSaveErr);
          });
      });
  });

  it('should be able to get a list of pods if not signed in', function (done) {
    // Create a new Pod model instance
    var podObj = new Pod(pod);

    // Save the pod
    podObj.save(function () {
      // Request pods
      agent.get('/api/pods')
        .end(function (req, res) {
          // Set the assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get a single pod if not signed in', function (done) {
    // Create new pod model instance
    var podObj = new Pod(pod);

    // Save the pod
    podObj.save(function () {
      agent.get('/api/pods/' + podObj._id)
        .end(function (req, res) {
          // Set the assertion
          res.body.should.be.instanceof(Object).and.have.property('username', pod.username);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return a proper error for single pod with an invalid id, if not signed in', function (done) {
    // Test is not a valid mongoose Id
    agent.get('/api/pods/test')
      .end(function (req, res) {
        // Set the assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Pod is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return a proper error for a single pod which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose id but a non-existent pod
    agent.get('/api/pods/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // set the assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Pod member with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete a pod if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/pods')
          .send(pod)
          .expect(403)
          .end(function (podSaveErr, podSaveRes) {
            // Call the assertion callback
            done(podSaveErr);
          });
      });
  });

  it('should not be able to delete a pod if not signed in', function (done) {
    // Set the pod user
    pod.user = user;

    // Create the new pod model instance
    var podObj = new Pod(pod);

    // Save the pod
    podObj.save(function () {
      agent.delete('/api/pods/' + podObj._id)
        .expect(403)
        .end(function (podDeleteErr, podDeleteRes) {
          // Set the message assertion
          (podDeleteRes.body.message).should.match('User is not authorized');

          // Handle the pod error error
          done(podDeleteErr);
        });
    });
  });

  it('should be able to get a single pod that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'P@$$w0rd!!'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new pod
          agent.post('/api/pods')
            .send(pod)
            .expect(200)
            .end(function (podSaveErr, podSaveRes) {
              // Handle pod save error
              if (podSaveErr) {
                return done(podSaveErr);
              }

              // Set assertion on new pod
              (podSaveRes.body.username).should.equal(pod.username);
              should.exist(podSaveRes.body.user);
              should.equal(podSaveRes.body.user._id, orphanId);

              // Force the pod to have a orphaned user reference
              orphan.remove(function () {
                // Now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the pod
                    agent.get('/api/pods/' + podSaveRes.body._id)
                      .expect(200)
                      .end(function (podInfoErr, podInfoRes) {
                        // Handle pod error
                        if (podInfoErr) {
                          return done(podInfoErr);
                        }

                        // Set the assetion
                        (podInfoRes.body._id).should.equal(podSaveRes.body._id);
                        (podInfoRes.body.username).should.equal(pod.username);
                        should.equal(podInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single pod is not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new pod model instance
    var podObj = new Pod(pod);

    // Save the pod
    podObj.save(function (err) {
      if (err) {
        return done(err);
      }

      agent.get('/api/pods/' + podObj._id)
        .end(function (req, res) {
          // Set the assertion
          res.body.should.be.instanceof(Object).and.have.property('username', pod.username);

          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated user
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get a single pod, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temp user creds
    var _creds = {
      usernameOrEmail: 'podowner',
      password: 'P@$$w0rd!!'
    };

    // Create user that will create the Pod
    var _podOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _podOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Signin with the user that will create the Pod
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new pod
          agent.post('/api/pods')
            .send(pod)
            .expect(200)
            .end(function (podSaveErr, podSaveRes) {
              // Handle pod save error
              if (podSaveErr) {
                return done(podSaveErr);
              }

              // Set the assertion on new pod
              (podSaveRes.body.username).should.equal(pod.username);
              should.exist(podSaveRes.body.user);
              should.equal(podSaveRes.body.user._id, userId);

              // Now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the pod
                  agent.get('/api/pods/' + podSaveRes.body._id)
                    .expect(200)
                    .end(function (podInfoErr, podInfoRes) {
                      // Handle pod error
                      if (podInfoErr) {
                        return done(podInfoErr);
                      }

                      // Set the assertions
                      (podInfoRes.body._id).should.equal(podSaveRes.body._id);
                      (podSaveRes.body.username).should.equal(pod.username);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current user didnt create it
                      (podInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Pod.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
