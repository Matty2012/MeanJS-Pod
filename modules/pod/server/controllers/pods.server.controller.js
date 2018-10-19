'use strict';

/**
 * Module Dependencies
 */
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var Pod = mongoose.model('Pod');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var multer = require('multer');
var multerS3 = require('multer-s3');
var aws = require('aws');
var amazonS3URI = require('amazon-s3-uri');
var config = require(path.resolve('./config/config'));

var useS3Storage = config.uploads.storage === 's3' && config.aws.s3;
var s3;

if (useS3Storage) {
  aws.config.update({
    accessKeyId: config.aws.s3.accessKeyId,
    secretAccessKey: config.aws.s3.secretAccessKey
  });

  s3 = new aws.S3();
}

/**
 * Create a pod
 */
exports.create = function (req, res) {
  var pod = new Pod(req.body);
  pod.user = req.user;
  pod.user.roles = ['pod'];

  pod.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pod);
    }
  });
};

/**
 * Show the current pod
 */
exports.read = function (req, res) {
  // Convert mongoose document to JSON
  var pod = req.pod ? req.pod.toJSON() : {};

  // Add a custom field to the Pod, for determining if the current User is the owner.
  // NOTE: This field is NOT permitted to the database, since it doesn't exist in the Pod model
  pod.isCurrentUserOwner = !!(req.user && pod.user && pod.user._id.toString() === req.user._id.toString());

  res.json(pod);
};

/**
 * Update a Pod
 */
exports.update = function (req, res) {
  var pod = req.pod;

  pod.username = req.body.username;

  if (req.user) {
    pod.firstName = pod.user.firstName;
    pod.lastName = pod.user.lastName;
  } else {
    pod.firstName = req.body.firstName;
    pod.lastName = req.body.lastName;
  }

  pod.age = req.body.age;
  pod.gender = req.body.gender;
  pod.description = req.body.description;
  pod.phone.house = req.body.phone.house;
  pod.phone.mobile = req.body.phone.mobile;
  pod.history = req.body.history;

  pod.address.line1 = req.body.address.line1;
  pod.address.line2 = req.body.address.line2;
  pod.address.line3 = req.body.address.line3;
  pod.address.postcode = req.body.address.postcode;
  pod.address.county = req.body.address.county;
  pod.address.city = req.body.address.city;

  pod.information.skills = req.body.information.skills;
  pod.information.credits = req.body.information.credits;
  pod.information.currentlyEmployed = req.body.information.currentlyEmployed;

  pod.information.workHistory.company1.companyName = req.body.information.workHistory.company1.companyName;
  pod.information.workHistory.company1.timeWorked = req.body.information.workHistory.company1.timeWorked;
  pod.information.workHistory.company1.jobTitle = req.body.information.workHistory.company1.jobTitle;
  pod.information.workHistory.company1.jobDescription = req.body.information.workHistory.company1.jobDescription;
  pod.information.workHistory.company1.address.line1 = req.body.information.workHistory.company1.address.line1;
  pod.information.workHistory.company1.address.line2 = req.body.information.workHistory.company1.address.line2;
  pod.information.workHistory.company1.address.line3 = req.body.information.workHistory.company1.address.line3;
  pod.information.workHistory.company1.address.postcode = req.body.information.workHistory.company1.address.postcode;
  pod.information.workHistory.company1.address.county = req.body.information.workHistory.company1.address.county;
  pod.information.workHistory.company1.address.city = req.body.information.workHistory.company1.address.city;

  pod.information.workHistory.company2.companyName = req.body.information.workHistory.company2.companyName;
  pod.information.workHistory.company2.timeWorked = req.body.information.workHistory.company2.timeWorked;
  pod.information.workHistory.company2.jobTitle = req.body.information.workHistory.company2.jobTitle;
  pod.information.workHistory.company2.jobDescription = req.body.information.workHistory.company2.jobDescription;
  pod.information.workHistory.company2.address.line1 = req.body.information.workHistory.company2.address.line1;
  pod.information.workHistory.company2.address.line2 = req.body.information.workHistory.company2.address.line2;
  pod.information.workHistory.company2.address.line3 = req.body.information.workHistory.company2.address.line3;
  pod.information.workHistory.company2.address.postcode = req.body.information.workHistory.company2.address.postcode;
  pod.information.workHistory.company2.address.county = req.body.information.workHistory.company2.address.county;
  pod.information.workHistory.company2.address.city = req.body.information.workHistory.company2.address.city;

  pod.information.workHistory.company3.companyName = req.body.information.workHistory.company3.companyName;
  pod.information.workHistory.company3.timeWorked = req.body.information.workHistory.company3.timeWorked;
  pod.information.workHistory.company3.jobTitle = req.body.information.workHistory.company3.jobTitle;
  pod.information.workHistory.company3.jobDescription = req.body.information.workHistory.company3.jobDescription;
  pod.information.workHistory.company3.address.line1 = req.body.information.workHistory.company3.address.line1;
  pod.information.workHistory.company3.address.line2 = req.body.information.workHistory.company3.address.line2;
  pod.information.workHistory.company3.address.line3 = req.body.information.workHistory.company3.address.line3;
  pod.information.workHistory.company3.address.postcode = req.body.information.workHistory.company3.address.postcode;
  pod.information.workHistory.company3.address.county = req.body.information.workHistory.company3.address.county;
  pod.information.workHistory.company3.address.city = req.body.information.workHistory.company3.address.city;

  pod.information.workHistory.podHistory.jobCounter = req.body.information.workHistory.podHistory.jobCounter;
  pod.information.workHistory.podHistory.hoursCounter = req.body.information.workHistory.podHistory.hoursCounter;

  pod.information.workHistory.preferences.distanceWillingToTravel = req.body.information.workHistory.preferences.distanceWillingToTravel;
  pod.information.workHistory.preferences.preferredTimes = req.body.information.workHistory.preferences.preferredTimes;
  pod.information.workHistory.preferences.preferredDays = req.body.information.workHistory.preferences.preferredDays;

  // TODO: Create more than one qualification in the Pod model

  pod.information.qualifications.name = req.body.information.qualifications.name;
  pod.information.qualifications.level = req.body.information.qualifications.level;
  pod.information.qualifications.dateObtained = req.body.information.qualifications.dateObtained;
  pod.information.qualifications.locationObtained = req.body.information.qualifications.locationObtained;

  pod.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pod);
    }
  });
};

/**
 * Delete a Pod
 */
exports.delete = function (req, res) {
  var pod = req.pod;

  pod.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pod);
    }
  });
};

/**
 * List of Pods
 */
exports.list = function (req, res) {
  Pod.find().sort('-created').populate('user', 'displayName').exec(function (err, pods) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pods);
    }
  });
};

/**
 * Change Profile Picture
 */
exports.changeProfilePicture = function (req, res) {
  var pod = req.pod;
  var existingImageUrl;
  var multerConfig;

  if (useS3Storage) {
    multerConfig = {
      storage: multerS3({
        s3: s3,
        bucket: config.aws.s3.bucket,
        acl: 'public-read'
      })
    };
  } else {
    multerConfig = config.uploads.profile.image;
  }

  // Filtering to upload only images
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

  var upload = multer(multerConfig).single('newProfilePicture');

  if (pod) {
    existingImageUrl = pod.profileImageURL;

    uploadImage()
      .then(updatePod)
      .then(deleteOldImage)
      .then(login)
      .then(function () {
        res.json(pod);
      })
      .catch(function (err) {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'Pod Is not signed in'
    });
  }

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updatePod() {
    return new Promise(function (resolve, reject) {
      pod.profileImageURL = config.uploads.storage === 's3' && config.aws.s3 ?
        req.file.location :
        '/' + req.file.path;

      pod.save(function (err, thepod) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== Pod.schema.path('profileImageURL').defaultValue) {
        if (useS3Storage) {
          try {
            var { region, bucket, key } = amazonS3URI(existingImageUrl);
            var params = {
              Bucket: config.aws.s3.bucket,
              Key: key
            };

            s3.deleteObject(params, function (err) {
              if (err) {
                console.log('Error occured while deleting old profile picture.');
                console.log('Check if you have sufficient permissions : ' + err);
              }
              resolve();
            });
          } catch (err) {
            console.warn(`${existingImageUrl} is not a valid S3 uri`);
            return resolve();
          }
        } else {
          fs.unlink(path.resolve('.' + existingImageUrl), function (unlinkError) {
            if (unlinkError) {
              // If the file doesn't exist, no need to reject the promise
              if (unlinkError.code === 'ENOENT') {
                console.log('Removing profile image failed because the file did not exist.');
                return resolve();
              }

              console.error(unlinkError);

              reject({
                message: 'Error occurred while deleting old profile picture'
              });
            } else {
              resolve();
            }
          });
        }
      } else {
        resolve();
      }
    });
  }

  function login() {
    return new Promise(function (resolve, reject) {
      req.login(pod, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Pod Middleware
 */
exports.podByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pod is invalid'
    });
  }

  Pod.findById(id).populate('user', 'displayName').exec(function (err, pod) {
    if (err) {
      return next(err);
    } else if (!pod) {
      return res.status(404).send({
        message: 'No Pod member with that identifier has been found'
      });
    }
    req.pod = pod;
    next();
  });
};
