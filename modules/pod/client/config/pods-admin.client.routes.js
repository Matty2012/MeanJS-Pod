(function () {
  'use strict';

  angular.module('pods.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.pods', {
        abstract: true,
        url: '/pods',
        template: '<ui-view/>'
      })
      .state('admin.pods.list', {
        url: '',
        templateUrl: '/modules/pod/client/views/admin/list-pods.client.view.html',
        controller: 'PodsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.pods.create', {
        url: '/create',
        templateUrl: '/modules/pod/client/views/admin/form-pod.client.view.html',
        controller: 'PodsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          podResolve: newPod
        }
      })
      .state('admin.pods.edit', {
        url: '/:podId/edit',
        templateUrl: '/modules/pod/client/views/admin/form-pod.client.view.html',
        controller: 'PodsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ podResolve.title }}'
        },
        resolve: {
          podResolve: getPod
        }
      });
  }

  getPod.$inject = ['$stateParams', 'PodsService'];

  function getPod($stateParams, PodsService) {
    return PodsService.get({
      podId: $stateParams.podId
    }).$promise;
  }

  newPod.$inject = ['PodsService'];

  function newPod(PodsService) {
    return new PodsService();
  }
}());
