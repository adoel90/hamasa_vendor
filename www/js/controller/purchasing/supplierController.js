distributionApp.controller("supplierController", function($scope, $rootScope, $supplierService, $modalService, $window, $myCookies){
  var accessToken = $myCookies.get("accessToken");
  
  $scope.searchFilters = [
    {by: "name", name: "Nama Supplier", placeholder: "Masukkan Nama Supplier"},
    {by: "id", name: "ID Supplier", placeholder: "Masukkan ID Supplier"}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.headings = [
    {name: "Supplier"},
    {name: "NPWP"},
    {name: "Kota"},
    {name: "Action"}
  ];

  $scope.requiredData = {
    limit: 10,
    offset: 0,
    id: '',
    name: ''
  }

  $scope.cols = ['name', 'npwp', 'cityName'];
  $scope.btnName = "Tambah Supplier";
  $scope.tableType = 'master-table';

  setTimeout(function(){ $scope.init(); },150);

  $scope.init = function(){
    getAllSuppliers($scope.requiredData);
  }

  function getAllSuppliers(data){
    $supplierService.get.supplier(data).then(function(response){
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].cityName = response.result.data[i].city ? response.result.data[i].city.name : '-';
      }
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.exportToExcel = function(){
    location.href = api.url + "report/original/supplier?accessToken=" + accessToken + '&id='+ $scope.requiredData.id + '&name='+ $scope.requiredData.name + "&export=" + true;
  }

  $scope.redirectToCreateNewData = function(){
    location.href = '/purchasing/supplier/createnewsupplier';
  }

  $scope.$on("editDataMaster", function(event, args){
    var supplierId = args.state.data.id;
    location.href = '/purchasing/supplier/editsupplier/' + supplierId;
  })

  $scope.$on("openDetailDataInTable", function(event, args){
    var supplierId = args.state.data.id;
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/detailSupplier.html'
    }

    $modalService.open(modalOptions)
    .then(function(response) {
      $supplierService.get.detailSupplier(supplierId).then(function(response){
        console.log(response);
        $scope.supplierDetail = {
          id: response.result.id,
          type: response.result.type,
          name: response.result.name,
          province: response.result.province != null ? response.result.province.name : '',
          city: response.result.city != null ? response.result.city.name : '',
          district: response.result.district != null ? response.result.district.name : '',
          urban: response.result.urban != null ? response.result.urban.name : '',
          postal_code: response.result.postal_code,
          address: response.result.address,
          phone: response.result.phone,
          contact_person: response.result.contact_person,
          npwp: response.result.npwp
        }
        $scope.$apply();
      })
      .catch(function(error){
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    })
  })

  $scope.$on("deleteDataMaster", function(event, args){
    var supplierId = args.state.data.id;
    $rootScope.deleteConfirmationModal("Apakah Anda yakin ingin menghapus supplier ini?", "Hapus", "Batal", function(){
      var supplier = {
        id: supplierId
      }
      $supplierService.delete.deleteSupplier(supplier)
      .then(function(response) {
          $rootScope.triggerModal("Supplier telah dihapus!", "Success", "success", "/purchasing/supplier");
      })
      .catch(function(error) {
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    })
  })

  $rootScope.$on('requestFetchData', function() {
    $scope.init();
  })

  $scope.doSearchFilter = function(val, type){
    $scope.requiredData.offset = 0;
    switch(type){
      case "id":{
        $scope.requiredData.id = val;
        $scope.requiredData.name = "";
        break;
      }
      case "name":{
        $scope.requiredData.name = val;
        $scope.requiredData.id = "";
        break;
      }
    }
    $scope.init();
  }

})
