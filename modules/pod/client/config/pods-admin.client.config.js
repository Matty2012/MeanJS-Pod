(function () {
  'use strict';

  // Configuring the Pods Admin module
  angular.module('pods.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Pods',
      state: 'admin.pods.list'
    });
  }
}());
