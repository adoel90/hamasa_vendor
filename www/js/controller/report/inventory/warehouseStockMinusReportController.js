distributionApp.controller('warehouseStockMinusController', function($scope, $rootScope, $warehouseService, $reportService, $moment, $myCookies){
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
    {name: "Grade"},
    {name: "Stok Plan"}
  ];

  $scope.cols = [
    {name: "ig_id", type: "text"},
    {name: "name", type: "text"},
    {name: "grade", type: "text"},
    {name: "plan", type: "number"}
  ];

  $scope.listReportData = null;

  $scope.printReport = function(){
    location.href = api.url + 'report/inventory/minus?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&warehouse_id=' + $scope.requiredData.warehouse_id + '&print=true';
  }

  $scope.viewReport = function(){
    $scope.requiredData.offset = 0;
    getWarehouseStockMinus($scope.requiredData);
  }

  function getWarehouseStockMinus(data){
    $reportService.get.warehouseStockMinus(data).then(response => {
      $scope.listReportData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $rootScope.$on('requestFetchData', function() {
    getWarehouseStockMinus($scope.requiredData);
  })
})
