(function () {
  'use strict';

  angular.module('pods')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$timeout', 'Authentication', 'Upload', 'Notification'];

  function ChangeProfilePictureController($timeout, Authentication, Upload, Notification) {
    var vm = this;

    vm.pod = Authentication.pod;
    vm.progress = 0;

    vm.upload = function (dataUrl) {
      Upload.upload({
        url: '/api/pods/picture',
        data: {
          newProfilePicture: dataUrl
        }
      })
      .then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the pod member has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show the success message
      Notification.success({ message: '<i class="glyphicon glyhphicon-ok"></i> Successfully changed profile picture' });

      // Populate user object
      vm.pod = Authentication.pod = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the pod member has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to change profile picture' });
    }
  }
}());
