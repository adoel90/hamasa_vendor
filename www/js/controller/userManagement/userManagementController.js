distributionApp.controller('userManagementController', function($scope, $rootScope, $userService, $modalService){
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    name: ''
  }
  console.log('aa');
  $scope.searchFilters = [
    {by: "name", name: "Nama User", placeholder: "Masukkan Nama User"}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.headings = [
    {name: "User Name"},
    {name: "Nama"},
    {name: "Akses Level"},
    {name: "Gudang"},
    {name: "Action"}
  ];

  setTimeout( () => {
    $scope.init();
  }, 150);

  $rootScope.$on('requestFetchData', function() {
   $scope.init();
  })

  $scope.init = function(){
    getListUser($scope.requiredData);
  }

  function getListUser(data){
    $userService.get.listUser(data).then(response => {
      console.log(response);
      $scope.userManagementList = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $scope.resetUserPassword = function(userId){
    var modalOptions = {
      scope: $scope
    }
    $modalService.alert(modalOptions).then(function(response){
      $scope.alert = {
          type: 'danger',
          title: 'Perhatian',
          message: 'Apakah Anda yakin ingin reset password user ini?',
          button: [
              { text: 'Tidak' },
              { type: 'danger', text: 'Lanjutkan' }
          ]
      }

      $scope.doAction = function(index) {
          switch(index) {
              case 0: {
                  $modalService.close();

                  break;
              }
              case 1: {
                  var userData = {
                    user_id: userId
                  }
                  $userService.put.resetUserPassword(userData).then(response => {
                    $rootScope.triggerModal("Reset password user berhasil", "Success", "success", "/usermanagement");
                  })
                  .catch(error => {
                    $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
                  })
                  break;
              }
          }
      }
    })


  }
  $scope.doSearchFilter = function(val, type){
    $scope.requiredData.offset = 0;
    switch(type){
      case "name":{
        $scope.requiredData.name = val;
      }
    }
    $scope.init();
  }

})
