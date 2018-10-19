'use strict';

/**
 * Module Dependencies
 */
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Pod = mongoose.model('Pod');

/**
 * Globals
 */
var user;
var pod;

/**
 * Unit Tests
 */
describe('Pod Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'pod@test.com',
      username: 'pod-username',
      password: 'P@$$w0rd!!',
      provider: 'local'
    });

    user.save()
      .then(function () {
        pod = new Pod({
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
          },
          user: user
        });
        done();
      })
      .catch(done);
  });

  describe('Method Save', function () {
    it('should be able to save without any problems', function (done) {
      this.timeout(10000);
      pod.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });
    describe('Check for validations on address etc', function (done) {

      it('should be able to show an error when trying to save without firstName', function (done) {
        pod.firstName = '';

        pod.save(function (err) {
          should.exist(err);
          return done();
        });
      });

      it('should be able to show an error when trying to save without lastName', function (done) {
        pod.lastName = '';

        pod.save(function (err) {
          should.exist(err);
          return done();
        });
      });

      it('should be able to show an error when trying to save without username', function (done) {
        pod.username = '';

        pod.save(function (err) {
          should.exist(err);
          return done();
        });
      });

      it('should be able to show an error when trying to save without the first line of address', function (done) {
        pod.address.line1 = '';

        pod.save(function (err) {
          should.exist(err);
          return done();
        });
      });

      it('should be able to show an error when trying to save without the second line of address', function (done) {
        pod.address.line2 = '';

        pod.save(function (err) {
          should.exist(err);
          return done();
        });
      });

      it('should be able to show an error when trying to save without the postcode', function (done) {
        pod.address.postcode = '';

        pod.save(function (err) {
          should.exist(err);
          return done();
        });
      });

      it('should be able to show an error when trying to save without the county', function (done) {
        pod.address.county = '';

        pod.save(function (err) {
          should.exist(err);
          return done();
        });
      });

      it('should be able to show an error when trying to save without the city', function (done) {
        pod.address.city = '';

        pod.save(function (err) {
          should.exist(err);
          return done();
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
