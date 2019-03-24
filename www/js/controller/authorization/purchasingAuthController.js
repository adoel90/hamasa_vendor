distributionApp.controller('purchasingAuthController', function($scope, $rootScope, $purchaseService, $salesService, $modalService){
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

  $scope.cols = [
    {name: 'date', type: 'text'},
    {name: 'typeName', type: 'text'},
    {name: 'status', type: 'badge'}
  ]

  $scope.btnName = null;
  $scope.tableType = 'table-badge';

  $scope.init = function(){
    getPurchaseAuthList($scope.requiredData);
  }

  setTimeout( () => {
    $scope.init();
  }, 200);

  $rootScope.$on('requestFetchData', function() {
    $scope.init();
  })

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

  function getPurchaseAuthList(data){
    $purchaseService.auth.get.purchaseAuthList(data).then(function(response){
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].typeName = response.result.data[i].type.name;
      }
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.$on("openDetailDataInTable", function(event, args){
    var auth = args.state.data;
    console.log(auth);
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/salesOrderDetail.html',
      size: 'lg'
    }
    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.purpose = "Request for PO";
      $scope.soAuthStatus = auth.status;

      $scope.authData = {
        id: auth.id,
        so_id: auth.so_id
      }

      $scope.initSoDetail = function(){
        $salesService.get.salesOrderDetail(auth.so_id).then(function(response){
          console.log(response);
          $scope.listFieldsInTheLeft = [
            {name: "Nomor SO", value: response.result.id, type: "text"},
            {name: "Tanggal SO", value: response.result.date, type: "text"},
            {name: "Status SO", value: response.result.status.name, type: "text"}
          ];
    
          $scope.listFieldsInTheRight = [
            {name: "ID Customer", value: response.result.customer.id, type: "text"},
            {name: "Nama Customer", value: response.result.customer.name, type: "text"},
            {name: "NPWP Customer", value: response.result.customer.npwp, type: "text"}
          ];
    
          $scope.salesOrderDetail = response.result;
          $scope.salesOrderDetail.headings = [
            {name: "Kategori"},
            {name: "Nama"},
            {name: "Unit"},
            {name: "Grade"},
            {name: "Harga Jual"},
            {name: "Quantity"},
            {name: "Gudang"},
            {name: "Keterangan"}
          ];

          $scope.$apply();
        })
        .catch(function(error){
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }

      $scope.acceptPoRequest = function(){
        location.href = "/purchasing/po/createpoforsofactory/" + encodeURIComponent($scope.authData.so_id);
      }
      
      $scope.rejectPoRequest = function(){
        $purchaseService.auth.delete.rejectForPoAuth($scope.authData).then(function(response){
          $rootScope.triggerModal("Po telah dibatalkan", "Success", "success", "/authorization/purchasingauth");
        })
        .catch(function(error){
          console.log(error);
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }
      setTimeout(()=>{ $scope.initSoDetail(); }, 200);
    })
  })

})
