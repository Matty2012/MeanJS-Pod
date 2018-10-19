(function () {
  'use strict';

  // Authentication service for user variables
  angular.module('pods.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      pod: $window.user
    };

    return auth;
  }
}());
