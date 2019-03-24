distributionApp.controller('categoryMasterController', function($scope, $rootScope, $categoryService, $myCookies){

  $scope.totalRows = 0;
  var accessToken = $myCookies.get('accessToken');

  $scope.requiredData = {
    limit: 10,
    offset: 0,
    name: ''
  }
  $scope.searchFilters = [
    {by: 'name', name: 'Nama Kategori'}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.headings = [
    {name: "ID Kategori"},
    {name: "Nama Kategori"},
    {name: "Action"}
  ];

  $scope.cols = ['id', 'name'];
  $scope.btnName = "Tambah Kategori";
  $scope.tableType = 'master-table';
  
  $scope.init = function(){
    getCategoryMaster($scope.requiredData);
  }

  function getCategoryMaster(data){
    $categoryService.get.listCategoryMaster(data).then(function(response){
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  setTimeout(function(){ $scope.init(); },100);

  $scope.$on('requestFetchData', function() {
    $scope.init();
  });

  $scope.redirectToCreateNewData = function(){
    location.href = '/inventory/categorymaster/createnewcategory';
  }

  $scope.doSearchFilter = function(val, type) {
    $scope.requiredData.offset = 0;
    switch(type) {
      case 'name': {
        $scope.requiredData.name = val;
        break;
      }
    }
    $scope.init();
  }

  $scope.$on("editDataMaster", function(event, args){
    var categoryId = args.state.data.id;
    location.href = '/inventory/categorymaster/editcategory/' + categoryId;
  })

  $scope.$on("deleteDataMaster", function(event, args){
    var categoryId = args.state.data.id;
    $rootScope.deleteConfirmationModal("Apakah Anda yakin ingin menghapus category ini?", "Hapus", "Batal", function(){
      var data = {
        id: categoryId
      }
      $categoryService.delete.categoryMaster(data).then(function(response) {
        $rootScope.triggerModal("Kategori telah dihapus", "Success", "success", "/inventory/categorymaster");
      })
      .catch(function(error) {
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    });
  })

  $scope.exportToExcel = function(){
    location.href = api.url + "report/inventory/item/category?accessToken=" + accessToken + "&export=" + true;
  }


});
