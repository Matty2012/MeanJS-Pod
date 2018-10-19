(function () {
  'use strict';

  angular.module('pods')
    .controller('PodsListController', PodsListController);

  PodsListController.$inject = ['PodsService'];

  function PodsListController(PodsService) {
    var vm = this;

    vm.pods = PodsService.query();
  }
}());
