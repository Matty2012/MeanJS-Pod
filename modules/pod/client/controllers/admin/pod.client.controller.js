(function () {
  'use strict';

  angular.module('pods.admin')
    .controller('PodsAdminController', PodsAdminController);

  PodsAdminController.$inject = ['$scope', '$state', '$window', 'podResolve', 'Authentication', 'Notification'];

  function PodsAdminController($scope, $state, $window, pod, Authentication, Notification) {
    var vm = this;

    vm.pod = pod;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Pod
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pod.$remove(function () {
          $state.go('admin.pods.list');
          Notification.success({ mesasge: '<i class="glyphicon glyphicon-ok"></a> Pod deleted successfully!' });
        });
      }
    }

    // Save Pod
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcase('show-errors-check-validity', 'vm.form.podForm');
        return false;
      }

      // Create a new pod, or update the current instance
      vm.pod.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.pods.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Pod saved successfully' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Pod save error!' });
      }
    }
  }
}());
