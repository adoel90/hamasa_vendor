distributionApp.controller('warehouseMasterController', function($scope, $rootScope, $warehouseService, $modalService, $myCookies) {
  
  'use strict';
  var accessToken = $myCookies.get("accessToken");

  $scope.headings = [
      { name: 'ID Gudang'},
      { name: 'Nama Gudang'},
      { name: 'Kode Gudang'},
      { name: 'Kota'},
      { name: 'Alamat', size: 'lg'},
      { name: 'Action'}
  ];

  $scope.searchFilters = [
    { by: 'id', name: 'ID Gudang', placeholder: 'Masukkan ID gudang' },
    { by: 'name', name: 'Nama Gudang', placeholder: 'Masukkan nama gudang' }
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.requiredData = {
    limit: 10,
    offset: 0,
    id: '',
    name: ''
  }

  $scope.cols = ['id', 'name', 'code', 'city', 'address'];
  $scope.btnName = "Tambah Gudang";
  $scope.tableType = 'master-table';

  $scope.redirectToCreateNewData = function(){
    location.href = '/inventory/warehousemaster/createnewwarehouse';
  }

  $scope.$on("openDetailDataInTable", function(event, args){
    var warehouseId = args.state.data.id;
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/warehouseDetail.html',
    }

    $modalService.open(modalOptions).then(function(response){
      $warehouseService.get.warehouseDetail(warehouseId).then(function(response){

        $scope.warehouseDetail = response.result;
        $scope.listFields = [
          { name: "ID Gudang", value: response.result.id },
          { name: "Nama Gudang", value: response.result.name },
          { name: "Kode Gudang", value: response.result.code },
          { name: "Kode DO", value: response.result.do_code },
          { name: "Kode BTB", value: response.result.btb_code },
          { name: "Kode BKB", value: response.result.bkb_code },
          { name: "Alamat", value: response.result.address },
          { name: "Provinsi", value: response.result.province.name },
          { name: "Kota", value: response.result.city ? response.result.city.name : '-' },
          { name: "Kecamatan", value: response.result.district ? response.result.district.name : '-' },
          { name: "Kelurahan", value: response.result.urban ? response.result.urban.name : '-' },
          { name: "Kode Pos", value: response.result.postal_code },
          { name: "No Telepon", value: response.result.phone }
        ]
        $scope.$apply();
      })
      .catch(function(error){
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    });

  })

  $scope.init = function() {
      getWarehouseList();
  }

  $scope.doSearchFilter = function(val, type) {
    $scope.requiredData.offset = 0;
    switch(type) {
      case 'id': {
          $scope.requiredData.id = val;
          $scope.requiredData.name = '';
          break;
      }
      case 'name': {
          $scope.requiredData.name = val;
          $scope.requiredData.id = '';
          break;
      }
    }

    $scope.init();
  }

  $scope.$on("deleteDataMaster", function(event, args){
    var warehouseId = args.state.data.id;
    $rootScope.deleteConfirmationModal("Apakah Anda yakin ingin menghapus gudang ini?", "Hapus", "Batal", function(){
      var warehouseData = {
          id: warehouseId
      }
      $warehouseService.delete.deleteWarehouse(warehouseData)
      .then(function(response) {
          $rootScope.triggerModal("Gudang telah dihapus!", "Success", "success", "/inventory/warehousemaster");
      })
      .catch(function(error) {
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    })
  })

  $scope.$on("editDataMaster", function(event, args){
    var warehouseId = args.state.data.id;
    location.href = '/inventory/warehousemaster/editwarehouse/' + warehouseId;
  })

  $scope.$on('requestFetchData', function() {
      $scope.init();
  });

  setTimeout(function() { $scope.init(); }, 100);

  function getWarehouseList() {
    $warehouseService.get.warehouseList($scope.requiredData).then(function(response) {
        console.log(response);
        $scope.totalRows = response.result.row;
        $scope.listData = response.result.data;
        $scope.$apply();
    })
  }

  $scope.exportToExcel = function(){
    location.href = api.url + "report/inventory/warehouse/list?accessToken=" + accessToken + "&export=" + true + '&id='+ $scope.requiredData.id + '&name='+ $scope.requiredData.name;
  }
  
})
