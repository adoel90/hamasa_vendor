distributionApp.controller('doOutstandingController', function($scope, $rootScope, $reportService, $warehouseService, $moment, $myCookies){
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    date: $moment(new Date()).format('YYYY-MM-DD'), //2017-08-18
    warehouse_id: '',
    print: false
  }

  // $scope.urlForPrint =$scope.accessToken = api.url + '/report/delivery/order/outstanding?accessToken=' + $myCookies.get('accessToken') + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&date=' + $scope.requiredData.date + '&warehouse_id=' + $scope.requiredData.warehouse_id + '&print=' + $scope.requiredData.print;
  $scope.headings = [
    {name: "No DO"},
    {name: "Tanggal DO"},
    {name: "Customer"},
    {name: "Kategori"},
    {name: "Nama Barang"},
    {name: "Jumlah Ambil"},
    {name: "Sisa Barang"}
  ];

  $scope.cols = [
    {name: 'do_id', type: 'text'},
    {name: 'do_date', type: 'text'},
    {name: 'customer_name', type: 'text'},
    {name: 'item_category_name', type: 'text'},
    {name: 'item_name', type: 'text'},
    {name: 'item_qty', type: 'number'},
    {name: 'item_outstanding', type: 'number'}
  ];

  $scope.printReport = function(){
    location.href = api.url + 'report/delivery/order/outstanding?accessToken=' + $myCookies.get('accessToken') + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&date=' + $scope.requiredData.date + '&warehouse_id=' + $scope.requiredData.warehouse_id + '&print=true';
  }

  $scope.viewReport = function(){
    console.log('do view report');
    $scope.requiredData.offset = 0;
    getListDoOutstandingReport($scope.requiredData);
  }

  function getListDoOutstandingReport(data){
    console.log('something calling this');
    $reportService.get.doOutstandingReport(data).then(response => {
      for(var i=0; i< response.result.data.length; i++){
        response.result.data[i].do_id = response.result.data[i].do.id;
        response.result.data[i].do_date = response.result.data[i].do.date;
        response.result.data[i].customer_name = response.result.data[i].customer.name;
        response.result.data[i].item_category_name = response.result.data[i].item.category.name;
        response.result.data[i].item_name = response.result.data[i].item.name;
        response.result.data[i].item_qty = response.result.data[i].item.quantity;
        response.result.data[i].item_outstanding = response.result.data[i].item.outstanding;
      }
      $scope.listReportData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.$on('requestFetchData', function() {
   getListDoOutstandingReport($scope.requiredData);
  })
})
