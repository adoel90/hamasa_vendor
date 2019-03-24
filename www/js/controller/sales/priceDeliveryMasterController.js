distributionApp.controller('priceDeliveryMasterController', function($scope, $rootScope, $deliveryService, $myCookies) {

  var accessToken = $myCookies.get("accessToken");
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    name: '',
    capacity: 0
  }

  $scope.searchFilters = [
    {by: 'name', name: 'Nama Pengiriman', placeholder: 'Masukkan nama pengiriman'},
    {by: 'capacity', name: 'Kapasitas Pengiriman', placeholder: 'Masukkan kapasitas pengiriman'}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.headings = [
    {name: "Nama Tujuan", size: 'lg'},
    {name: "Jenis Kendaraan"},
    {name: "Kapasitas"},
    {name: "Harga"},
    {name: "Action"}
  ];

  $scope.cols = [
    {name: 'name', type: 'text'},
    {name: 'vehicle', type: 'text'},
    {name: 'capacity', type: 'number'},
    {name: 'price', type: 'number'}
  ];

  $scope.btnName = "Tambah Pengiriman";
  $scope.tableType = 'master-table-with-price';

  $scope.redirectToCreateNewData = function(){
    location.href = '/sales/pricedelivery/createnewpricedelivery';
  }

  $scope.$on("editDataMaster", function(event, args){
    var priceDeliveryId = args.state.data.id;
    location.href = '/sales/pricedelivery/editpricedelivery/' + priceDeliveryId;
  })

  function getListPriceDelivery(data){
    $deliveryService.get.listPriceDelivery($scope.requiredData).then(function(response){
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.init = function(){
    getListPriceDelivery($scope.requiredData);
  }

  setTimeout(function(){ $scope.init(); }, 100);

  $scope.doSearchFilter = function(val, type){
    switch(type){
      case "name":{
        $scope.requiredData.name = val;
        $scope.requiredData.capacity = "";
        break;
      }
      case "capacity":{
        $scope.requiredData.name = "";
        $scope.requiredData.capacity = val;
        break;
      }
    }
    $scope.init();
  }
  $scope.$on('requestFetchData', function(event, args) {
    $scope.init();
  });

  $scope.$on("deleteDataMaster", function(event, args){
    var priceDeliveryId = args.state.data.id;
    $rootScope.deleteConfirmationModal("Apakah Anda ingin menghapus harga pengiriman ini?", "Hapus", "Batal", function(){
      $scope.deleteData = {
         id: priceDeliveryId
      }
      $deliveryService.delete.deletePriceDelivery($scope.deleteData).then(function(response){
         $rootScope.triggerModal("Harga pengiriman ini telah dihapus", "Success", "success", "/sales/pricedelivery");
      })
      .catch(function(error){
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    })
  });

  $scope.exportToExcel = function(){
    location.href = api.url + "report/original/delivery/price?accessToken=" + accessToken + "&export=" + true;
  }

});
