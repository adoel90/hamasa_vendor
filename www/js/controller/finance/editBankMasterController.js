distributionApp.controller('editBankMasterController', function($scope, $rootScope, $bankService){

  $scope.requiredData = {};
  $scope.purpose = "Update Bank";

  $rootScope.bankId = encodeURIComponent(routeParams.id);
  setTimeout(() => {
    $scope.getDetailBank(routeParams.id);
  }, 150);

  $scope.getDetailBank = function(id){
    $bankService.get.bankDetail(id).then(response => {
      console.log(response);
      $scope.requiredData = response.result;
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $scope.save = function(){
    $bankService.put.updateBank($scope.requiredData).then(response => {
      $rootScope.triggerModal("Bank berhasil diupdate", "Success", "success", "/finance/bankmaster");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
});
