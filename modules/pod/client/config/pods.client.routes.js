(function () {
  'use strict';

  angular.module('pods.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pods', {
        abstract: true,
        url: '/pods',
        template: '<ui-view/>'
      })
      .state('pods.list', {
        url: '',
        templateUrl: '/modules/pod/client/views/list-pods.client.view.html',
        controller: 'PodsListController',
        controllerAs: 'vm'
      })
      .state('pods.view', {
        url: '/:podId',
        templateUrl: '/modules/pod/client/views/view-pod.client.view.html',
        controller: 'PodsController',
        controllerAs: 'vm',
        resolve: {
          podResolve: getPod
        },
        data: {
          pageTitle: '{{ podResolve.title }}'
        }
      })
      .state('pods.profile', {
        url: '/profile',
        templateUrl: '/modules/pod/client/views/profile/edit-profile.client.view.html',
        controller: 'EditProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Profile'
        }
      })
      .state('pods.picture', {
        url: '/picture',
        templateUrl: '/modules/pod/client/views/profile/change-profile-picture.client.view.html',
        controller: 'ChangeProfilePictureController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Profile Picture'
        }
      });
  }

  getPod.$inject = ['$stateParams', 'PodsService'];

  function getPod($stateParams, PodsService) {
    return PodsService.get({
      podId: $stateParams.podId
    }).$promise;
  }
}());
