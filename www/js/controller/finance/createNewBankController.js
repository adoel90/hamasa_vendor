distributionApp.controller('createNewBankController', function($scope, $rootScope, $bankService){
  $scope.requiredData = {
    account: '',
    bank: ''
  }

  $scope.save = function(){
    $bankService.post.createBank($scope.requiredData).then(response => {
      $rootScope.triggerModal("Bank berhasil ditambahkan", "Success", "success", "/finance/bankmaster");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

})
