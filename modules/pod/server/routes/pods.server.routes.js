'use strict';

/**
 * Module Dependencies
 */
var podsPolicy = require('../policies/pods.server.policy');
var pods = require('../controllers/pods.server.controller');

module.exports = function (app) {
  // Pod collection routes
  app.route('/api/pods').all(podsPolicy.isAllowed)
    .get(pods.list)
    .post(pods.create);

  // Single pod routes
  app.route('/api/pods/:podId').all(podsPolicy.isAllowed)
    .get(pods.read)
    .put(pods.update)
    .delete(pods.delete);

  app.route('/api/pods/picture').post(pods.changeProfilePicture);

  // Finish by binding the pod middleware
  app.param('podId', pods.podByID);
};
