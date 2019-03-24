distributionApp.controller('inventoryAuthController', function($scope, $rootScope, $modalService, $inventoryService){
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
    {name: "Nama Otorisasi"}
  ];

  $scope.cols = ['date', 'typeName'];
  $scope.btnName = null;
  $scope.tableType = 'non-edited-table';

  setTimeout(() => { $scope.init(); },150);

  $scope.init = function(){
    getInventoryAuthList($scope.requiredData);
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

  $rootScope.$on('requestFetchData', function() {
    $scope.init();
  })

  $scope.$on("openDetailDataInTable", function(event, args){
    var inventoryAuthId = args.state.data.id;
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/itemStockWarehouseDetail.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {

      $scope.itemHeadings = [
        {name: "Kategori"},
        {name: "Nama Barang"},
        {name: "Satuan"},
        {name: "Grade"},
        {name: "Jumlah Awal"},
        {name: "Jumlah Perubahan"},
        {name: "Keterangan"},
        {name: "Status"},
        {name: "Action"}
      ];

      setTimeout(()=>{
        $scope.initItemStockWarehouse();
      }, 150);

      $scope.initItemStockWarehouse = function(){
        $inventoryService.get.inventoryAuthDetail(inventoryAuthId).then(response => {
          $scope.itemStockWarehouse = response.result;
          for(var i=0; i < $scope.itemStockWarehouse.item.length; i++){
            $scope.itemStockWarehouse.item[i].statusName = $scope.defineAuthStatus($scope.itemStockWarehouse.item[i].status);
          }
          $scope.$apply();
        })
        .catch(error => {
          console.log(error);
        })
      }

      $scope.acceptItemStockAdjustment = function(item){
        $scope.authData = {
          authinv_id: item.authinv_id
        }
        accessApiToApproveInventoryAdjustment($scope.authData);
      }

      $scope.rejectItemStockAdjustment = function(item){
        $scope.authData = {
          authinv_id: item.authinv_id
        }
        accessApiToRejectInventoryAdjustment($scope.authData);
      }
    })
  })


  function accessApiToApproveInventoryAdjustment(data){
    $inventoryService.post.approveInventoryAdjustment(data).then(response => {
      $rootScope.triggerModal("Otorisasi perubahan stok telah diterima", "Success", "success", "/authorization/inventoryauth");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function accessApiToRejectInventoryAdjustment(data){
    $inventoryService.delete.rejectAdjustItemIventory(data).then(response => {
      $rootScope.triggerModal("Perubahan stok item telah ditolak", "Success", "success", "/authorization/inventoryauth");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }


  function getInventoryAuthList(data){
    $inventoryService.get.inventoryAuthList(data).then(response => {
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].typeName = response.result.data[i].type.name;
      }
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

})
