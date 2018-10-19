'use strict';

/**
 * Module Dependencies
 */
var acl = require('acl');

// Using memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Pods Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/pods',
      permissions: '*'
    }, {
      resources: '/api/pods/:podId',
      permissions: '*'
    }]
  }, {
    roles: ['pod'],
    allows: [{
      resources: '/api/pods',
      permissions: ['get']
    }, {
      resources: '/api/pods/:podId',
      permissions: ['get']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/pods',
      permissions: ['get']
    }, {
      resources: '/api/pods/:podId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check if Pods Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['user'];

  // If a pod is being processed and the current user created it then allow any manipulation
  if (req.pod && req.user && req.pod.user && req.pod.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An unauthorized error occured
      return res.status(500).send('Unexpected authorization errror');
    } else {
      if (isAllowed) {
        // Access Granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
