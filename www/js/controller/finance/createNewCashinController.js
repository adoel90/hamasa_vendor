distributionApp.controller('createNewCashinController', function($scope, $rootScope, $bankService, $cashService, $myCookies){
  $scope.page = 'cashin';
  var accessToken = $myCookies.get("accessToken");

  $scope.requiredData = {
    date: '',
    from: '',
    note: '',
    method: null,
    selectedPaymentMethod: null,
    total: '',
    bank: null,
    selectedBank: null,
    proof: '',
    due_date: ''
  }

  $scope.saveChanges = function(){
    console.log($scope.requiredData);
    if($scope.requiredData.method > 0 && $scope.requiredData.bank == null){
      $rootScope.triggerModal("Bank harus diisi jika metode pembayaran cek, giro atau transfer.", "Error", "danger", "");
    }
    else{
      createCashin($scope.requiredData);
    }
  }

  function createCashin(data){
    $scope.requiredData.total = $rootScope.numberWithNoCommas($scope.requiredData.total);
    setTimeout(() => {
      $cashService.post.createCashin(data).then(response => {
        console.log(response);
        var redirectToBKM = api.url + "cash/in/print?accessToken=" + accessToken + "&id=" + response.result;
        $rootScope.triggerModal("Kas masuk berhasil dibuat", "Success", "success", redirectToBKM);
      })
      .catch(error => {
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    }, 150);
  }

});
