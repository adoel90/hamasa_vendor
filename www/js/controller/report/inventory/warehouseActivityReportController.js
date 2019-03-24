distributionApp.controller('warehouseActivityReportController', function($scope, $rootScope, $reportService, $warehouseService, $moment, $myCookies){
  var accessToken = $myCookies.get("accessToken");

  $scope.headings = [
    {name: "Nama Barang"},
    {name: "No Bukti"},
    {name: "No Do"},
    {name: "Nama Customer"},
    {name: "Masuk"},
    {name: "Keluar"},
    {name: "Akhir"}
  ];

  $scope.cols = [
    {name: "proof", type: "text"},
    {name: "do_id", type: "text"},
    {name: "note", type: "text"},
    {name: "name", type: "text"},
    {name: "in", type: "number"},
    {name: "out", type: "number"},
    {name: "final", type: "number"}
  ];

  $scope.todayDate = $moment(new Date()).format('YYYY-MM-DD');
  $scope.listReportData = null;

  $scope.requiredData = {
    limit: "",
    offset: "",
    warehouse_id: "",
    date: $moment(new Date()).format('YYYY-MM-DD'),
    print: false,
    name: ""
  }

  $scope.viewReport = function(){
    $scope.requiredData.offset = 0;
    getWarehouseActivityReport($scope.requiredData);
  }

  function getWarehouseActivityReport(data){
    $reportService.get.warehouseActivity(data).then(response => {
      console.log(response);
      for(var i=0; i < response.result.length; i++){
        response.result[i].note = response.result[i].note ? response.result[i].note : '-';
        response.result[i].in = response.result[i].in ? response.result[i].in : 0;
        response.result[i].out = response.result[i].out ? response.result[i].out : 0;
      }
      $scope.listReportData = response.result;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $rootScope.$on('requestFetchData', function() {
    getWarehouseActivityReport($scope.requiredData);
  });

  $scope.printReport = function(){
    location.href = api.url + 'report/inventory/activity?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&date=' + $scope.requiredData.date + '&warehouse_id=' + $scope.requiredData.warehouse_id + '&print=true';
  }
})
