distributionApp.controller('warehouseStockReportController', function($scope, $rootScope, $reportService, $warehouseService, $moment, $myCookies){
  var accessToken = $myCookies.get("accessToken");

  $scope.requiredData = {
    warehouse_id: '',
    limit: 10,
    offset: 0,
    print: false
  }
  
  $scope.todayDate = $moment(new Date()).format('YYYY-MM-DD');
  $scope.headings = [
    {name: "Kode Barang"},
    {name: "Nama Barang"},
    {name: "Stok Aktual"},
    {name: "Stok Plan"}
  ];

  $scope.cols = [
    {name: "ig_id", type: "text"},
    {name: "name", type: "text"},
    {name: "grade", type: "text"},
    {name: "actual", type: "number"}
  ];

  $scope.listReportData = null;

  $scope.printReport = function(){
    console.log('print report now');
    location.href = api.url + 'report/inventory/stock?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&warehouse_id=' + $scope.requiredData.warehouse_id + '&print=true';
  }

  $scope.viewReport = function(){
    $scope.requiredData.offset = 0;
    getWarehouseStock($scope.requiredData);
  }

  function getWarehouseStock(data){
    console.log('request api warhouse stock');
    $reportService.get.warehouseStock(data).then(response => {
      console.log(response);
      $scope.warehouseStockList = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $rootScope.$on('requestFetchData', function() {
    getWarehouseStock($scope.requiredData);
  })

});
