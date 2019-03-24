distributionApp.controller('financeAuthController', function($scope, $rootScope, $modalService, $financeService, $customerService){
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    date: ''
  }

  $scope.searchFilters = [
    {by: "date", name: "Tanggal Otorisasi", placeholder: "Masukkan tanggal otorisasi"}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  };

  $scope.headings = [
    {name: "Tanggal"},
    {name: "Nama Otorisasi"},
    {name: "Status Otorisasi"}
  ];

  setTimeout(() => {
    $scope.init();
  }, 200);

  $rootScope.$on('requestFetchData', function() {
   $scope.init();
 })

  $scope.defineAuthStatus = function(statusId){
    if(statusId == 0) return "-";
    else if(statusId == 1) return "Approved";
    else if(statusId == -1) return "Rejected";
  }

  $scope.init = function(){
    getFinanceAuthList($scope.requiredData);
  }

  function getFinanceAuthList(data){
    $financeService.get.financeAuthList(data).then(response => {
      $scope.financeAuthList = response.result.data;
      $scope.totalRows = response.result.row;
      for(var i=0; i<$scope.financeAuthList.length; i++){
        $scope.financeAuthList[i].statusName = $scope.defineAuthStatus($scope.financeAuthList[i].status);
      }
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.doSearchFilter = function(val, type){
    $scope.requiredData.offset = 0;
    switch(type){
      case "date":{
        $scope.requiredData.date = val;
        break;
      }
    }
    $scope.init();
  }

  $scope.viewDetailCustomer = function(financeAuth){
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/customerDetail.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.purpose = "Approval for Customer Credit";
      $scope.financeAuthStatus = financeAuth.status;

      $scope.authData = {
        id: financeAuth.id
      }
      $scope.address = {
        headings: [
          { name: 'Alamat', size: 'lg' },
          { name: 'Provinsi'},
          { name: 'Kota' },
          { name: 'Kecamatan'},
          { name: 'Kelurahan'},
          {	name: 'Kode Pos'}
        ]
      }

      $scope.contact = {
        headings: [
          { name: 'Phone' },
          { name: 'Contact Person'}
        ]
      }
      
      setTimeout(() => {
        $scope.initCustomerDetail();
      }, 150);

      $scope.initCustomerDetail = function(){
        $customerService.get.customerDetail(financeAuth.c_id).then(response => {
          console.log(response);
          $scope.customerDetail = response.result;
          $scope.$apply();
        })
        .catch(error => {
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }

      $scope.acceptCustomerCreditStatus = function(){
        accessApiToAcceptCustomerCredit($scope.authData);
      }
      $scope.rejectCustomerCreditStatus = function(){
        accessApiToRejectAuthorization($scope.authData);
      }
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function accessApiToAcceptCustomerCredit(data){
    $financeService.post.approveCustomerCredit(data).then(response => {
      $rootScope.triggerModal("Customer Credit telah diterima", "Success", "success", "/authorization/financeauth");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function accessApiToRejectAuthorization(data){
    $financeService.delete.rejectForFinanceAuth(data).then(response => {
      $rootScope.triggerModal("Status kredit pelanggan telah ditolak", "Success", "success", "/authorization/financeauth");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
})
