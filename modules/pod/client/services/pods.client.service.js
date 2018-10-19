(function () {
  'use strict';

  angular.module('pods.services')
    .factory('PodsService', PodsService);

  PodsService.$inject = ['$resource', '$log'];

  function PodsService($resource, $log) {
    var Pod = $resource('/api/pods/:podId', {
      podId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Pod.prototype, {
      createOrUpdate: function () {
        var pod = this;
        return createOrUpdate(pod);
      }
    });

    return Pod;

    function createOrUpdate(pod) {
      if (pod._id) {
        return pod.$update(onSuccess, onError);
      } else {
        return pod.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(pod) {

      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle the error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
