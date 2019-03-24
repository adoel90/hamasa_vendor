distributionApp.controller('bankMasterController', function($scope, $rootScope, $bankService, $myCookies){
  var accessToken = $myCookies.get('accessToken');

  $scope.requiredData = {
    limit: 10,
    offset: 0
  }

  $scope.headings = [
    {name: "Bank"},
    {name: "Account"},
    {name: "Action"}
  ];

  $scope.cols = ['bank', 'account'];
  $scope.btnName = "Tambah Bank";
  $scope.tableType = 'master-table';

  setTimeout(() => { $scope.init(); }, 150);

  $scope.init = function(){
    getBankList($scope.requiredData);
  }

  $scope.redirectToCreateNewData = function(){
    location.href = '/finance/bankmaster/createnewbank';
  }

  function getBankList(data){
    $bankService.get.bankList(data).then(response => {
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.$on("editDataMaster", function(event, args){
    var bankAccount = args.state.data.account;
    location.href = '/finance/bankmaster/editbank/' + bankAccount;
  })

  $scope.$on("deleteDataMaster", function(event, args){
    var bankAccount = args.state.data.account;
    $rootScope.deleteConfirmationModal("Apakah Anda yakin ingin menghapus bank ini?", "Hapus", "Batal", function(){
      var bankToDelete = {
        account: bankAccount
      }
      $bankService.delete.bank(bankToDelete).then(response => {
        $rootScope.triggerModal("Bank berhasil dihapus!", "Success", "success", "/finance/bankmaster");
      })
      .catch(error => {
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    })
  })

  $scope.exportToExcel = function(){
    location.href = api.url + "report/finance/bank/list?accessToken=" + accessToken + "&export=" + true;
  }

  $rootScope.$on('requestFetchData', function() {
		$scope.init();
  })
  
})
