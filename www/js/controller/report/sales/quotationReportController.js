distributionApp.controller('quotationReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
  var accessToken = $myCookies.get("accessToken");

  $scope.requiredData = {
    limit: 10,
    offset: 0,
    date: $moment(new Date()).format('YYYY-MM-DD'),
    print: false
  }

  $scope.headings = [
    {name: "Tgl Penawaran"},
    {name: "No Penawaran"},
    {name: "Customer"},
    {name: "Jumlah"},
    {name: "Total Harga"},
    {name: "Sales"},
    {name: "Realisasi SO"}
  ];

  $scope.cols = [
    {name: "date", type: "text"},
    {name: "id", type: "text"},
    {name: "customerName", type: "text"},
    {name: "quantity", type: "number"},
    {name: "total", type: "number"},
    {name: "salesName", type: "text"},
    {name: "so_status", type: "text"},
  ]

  $scope.listReportData = null;

  setTimeout(()=>{ $scope.init(); }, 120);

  $scope.init = function(){
    getQuotationReport($scope.requiredData);
  }

  function getQuotationReport(data){
    $reportService.get.quotationReport(data).then(response => {
      console.log(response);
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].customerName = response.result.data[i].customer.name;
        response.result.data[i].salesName = response.result.data[i].sales.name;
        response.result.data[i].so_status = response.result.data[i].so_id ? 'Terealisasi' : '-';
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

  $scope.viewReport = function(){
    $scope.requiredData.offset = 0;
    $scope.init();
  }

  $scope.printReport = function(){
    location.href = api.url + 'report/quotation?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&date=' + $scope.requiredData.date + '&print=true';
  }

  $rootScope.$on('requestFetchData', function() {
   $scope.init();
  })

});
