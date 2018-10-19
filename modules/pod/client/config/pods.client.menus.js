(function () {
  'use strict';

  angular.module('pods')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Pods',
      state: 'pods',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list
    menuService.addSubMenuItem('topbar', 'pods', {
      title: 'List Pods',
      state: 'pods.list',
      roles: ['*']
    });
  }
}());
