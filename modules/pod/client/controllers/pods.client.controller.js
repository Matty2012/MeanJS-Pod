(function () {
  'use strict';

  angular.module('pods')
    .controller('PodsController', PodsController);

  PodsController.$inject = ['$scope', 'podResolve', 'Authentication'];

  function PodsController($scope, pod, Authentication) {
    var vm = this;

    vm.pod = pod;
    vm.authentication = Authentication;
  }
}());
