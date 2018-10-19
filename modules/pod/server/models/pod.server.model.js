'use strict';

/**
 * Module Dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var path = require('path');
var config = require(path.resolve('./config/config'));
var chalk = require('chalk');

/**
 * Pod Schema
 */
var PodSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  firstName: {
    type: String,
    default: '',
    trim: true,
    required: 'Pod first name is required'
  },
  lastName: {
    type: String,
    default: '',
    trim: true,
    required: 'Pod last name is required'
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    required: 'Gender is required'
  },
  description: {
    type: String,
    required: 'Description is required'
  },
  phone: {
    house: {
      type: String
    },
    mobile: {
      type: String
    }
  },
  history: {
    type: [String]
  },
  username: {
    type: String,
    default: '',
    trim: true,
    required: 'Username cannot be blank'
  },
  address: {
    line1: {
      type: String,
      default: '',
      required: 'Line 1 of your address is required and must not be blank'
    },
    line2: {
      type: String,
      default: '',
      required: 'Line 2 of your address is required and must not be blank'
    },
    line3: String,
    postcode: {
      type: String,
      default: '',
      required: 'Postcode is required and must not be blank'
    },
    county: {
      type: String,
      default: '',
      required: 'County is required and must not be blank'
    },
    city: {
      type: String,
      default: '',
      required: 'City is required and must not be blank'
    }
  },
  information: {
    skills: {
      type: [String]
    },
    credits: String,
    currentlyEmployed: Boolean,
    workHistory: {
      company1: {
        companyName: {
          type: String
          // required: 'Company name is required for at least 1'
        },
        timeWorked: {
          type: String
          // required: 'Time worked is required for at least 1'
        },
        jobTitle: {
          type: String
          // required: 'Job title is required for at least 1'
        },
        jobDescription: {
          type: String
          // required: 'Job description is required for at least 1'
        },
        address: {
          line1: {
            type: String
          },
          line2: {
            type: String
          },
          line3: {
            type: String
          },
          postcode: {
            type: String
          },
          county: {
            type: String
          },
          city: {
            type: String
          }
        }
      },
      company2: {
        companyName: {
          type: String
        },
        timeWorked: {
          type: String
        },
        jobTitle: {
          type: String
        },
        jobDescription: {
          type: String
        },
        address: {
          line1: {
            type: String
          },
          line2: {
            type: String
          },
          line3: {
            type: String
          },
          postcode: {
            type: String
          },
          county: {
            type: String
          },
          city: {
            type: String
          }
        }
      },
      company3: {
        companyName: {
          type: String
        },
        timeWorked: {
          type: String
        },
        jobTitle: {
          type: String
        },
        jobDescription: {
          type: String
        },
        address: {
          line1: {
            type: String
          },
          line2: {
            type: String
          },
          line3: {
            type: String
          },
          postcode: {
            type: String
          },
          county: {
            type: String
          },
          city: {
            type: String
          }
        }
      },
      podHistory: {
        jobCounter: Number,
        hoursCounter: Number
      },
      preferences: {
        distanceWillingToTravel: String,
        preferredTimes: String,
        preferredDays: String
      }
    },
    qualifications: {
      name: String,
      level: String,
      dateObtained: String,
      locationObtained: String
    }
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Pod', PodSchema);

/**
 * Seeds the User collection with document (Pod)
 * and provided options
 */
function seed(doc, options) {
  var Pod = mongoose.model('Pod');

  return new Promise(function (resolve, reject) {
    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User.findOne({ roles: { $in: ['admin'] } })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Pod.findOne({ username: doc.username })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Pod (overwrite)
            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }
              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Pod\t' + doc.username + ' skipped')
          });
        }

        var pod = new Pod(doc);

        pod.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Pod\t' + pod.username + ' added'
          });
        });
      });
    }
  });
}
