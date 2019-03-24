distributionApp.controller('settingsController', function($scope, $rootScope, $myCookies, $modalService, $userService){

  $scope.settingsData = {
    fullname: '',
    password: '',
    confPassword: ''
  }

  var userData = null;

  setTimeout(() => {
    $scope.init();
  }, 150);

  $scope.init = function(){
    userData = $myCookies.getObject('userData');
    $scope.settingsData.fullname = userData.name;
    $scope.$apply();
  }

  $scope.triggerModal = function(customMessage, customTitle, modalType){
    var modalOptions = {
      scope: $scope
    }

    $modalService.alert(modalOptions)
    .then(function() {
      $scope.alert = {
        type: modalType,
        title: customTitle,
        message: customMessage,
        button: [
          { type: modalType, text: 'Kembali' }
        ]
      }

      $scope.doAction = function(index) {
        switch(index) {
          case 0: {
            $modalService.close();
            if(modalType == "success") $window.history.back();
            break;
          }
        }
      }

    })
    .catch(function(error) {
      console.warn(error);
    })
  }

  $scope.saveChanges = function(){
    if($scope.settingsData.password != $scope.settingsData.confPassword){
      $scope.triggerModal("Password dan konfirmasi password harus sama", "Error", "danger");
    }
    else{
      updateUserProfile($scope.settingsData);
    }
  }

  function updateUserProfile(data){
    $userService.put.updateProfile(data).then(response => {
      userData.name = data.fullname;
      $myCookies.putObject("userData", userData);
      $scope.triggerModal("Update data user berhasil!", "success", "success");
      $scope.$apply();
    })
    .catch(error => {
      $scope.triggerModal(error.responseJSON.message, "Error", "danger");
    })
  }

});
