(function () {
  'use strict';

  angular.module('pods.admin')
    .controller('PodsAdminListController', PodsAdminListController);

  PodsAdminListController.$inject = ['PodsService'];

  function PodsAdminListController(PodsService) {
    var vm = this;

    vm.pods = PodsService.query();
  }
}());
