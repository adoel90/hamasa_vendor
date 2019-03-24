distributionApp.controller('warehouseReorderReportController', function($scope, $rootScope, $reportService, $warehouseService, $moment, $myCookies){
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    warehouse_id: '',
    print: false
  }
  
  $scope.todayDate = $moment(new Date()).format('YYYY-MM-DD');
  $scope.warehouseReorderList = null;
  $scope.headings = [
    {name: "Kode Barang"},
    {name: "Nama Barang"},
    {name: "Stok Aktual"},
    {name: "Stok Planning"},
    {name: "ROP"},
    {name: "Restock"}
  ];

  $scope.cols = [
    {name: "ig_id", type: "text"},
    {name: "name", type: "text"},
    {name: "actual", type: "number"},
    {name: "plan", type: "number"},
    {name: "stock_max", type: "number"},
    {name: "stock_min", type: "number"},
    {name: "restock", type: "number"},
  ];


  $scope.viewReport = function(){
    $scope.requiredData.offset = 0;
    getWarehouseReorderReport($scope.requiredData);
  }

  $scope.printReport = function(){
    location.href = api.url + 'report/purchase/reorder?accessToken=' + $myCookies.get('accessToken') + '&warehouse_id=' + $scope.requiredData.warehouse_id + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&print=' + true;
  }

  function getWarehouseReorderReport(data){
    $reportService.get.warehouseReorder(data).then(response => {
      console.log(response);
      
      $scope.listReportData = response.result.data;
      // for(var i=0; i < $scope.listReportData.length; i++){
      //   $scope.listReportData[i].restock = parseInt($scope.listReportData[i].stock_max) - parseInt($scope.listReportData[i].plan);
      // }
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $rootScope.$on('requestFetchData', function() {
    getWarehouseReorderReport($scope.requiredData);
  })
})
