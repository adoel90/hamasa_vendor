distributionApp.controller("creditInvoiceReportController", function($scope, $rootScope, $reportService, $moment, $myCookies){
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    date: $moment(new Date()).format('YYYY-MM-DD'),
    print: false
  }

  $scope.headings = [
    {name: "Tgl Faktur"},
    {name: "No Faktur"},
    {name: "No Seri Pajak"},
    {name: "No SO"},
    {name: "Total"},
    {name: "Customer"},
    {name: "Sales"},
    {name: "Tgl Jatuh Tempo"},
    {name: "Status Faktur"}
  ];

  $scope.cols = [
    {name: 'date', type: 'text'},
    {name: 'id', type: 'text'},
    {name: 'tax_serial', type: 'text'},
    {name: 'so_id', type: 'text'},
    {name: 'total', type: 'number'},
    {name: 'customerName', type: 'text'},
    {name: 'salesName', type: 'text'},
    {name: 'due_date', type: 'text'},
    {name: 'status', type: 'text'}
  ];

  setTimeout(()=>{ getCreditInvoiceReport($scope.requiredData); }, 120);

  $scope.viewReport = function(){
    $scope.requiredData.offset = 0;
    getCreditInvoiceReport($scope.requiredData);
  }

  $scope.printReport = function(){
    location.href = api.url + 'report/invoice/credit?accessToken=' + $myCookies.get('accessToken') + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&date=' + $scope.requiredData.date + '&print=' + true;
  }

  function getCreditInvoiceReport(data){
    $reportService.get.creditInvoice(data).then(response => {
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].customerName = response.result.data[i].customer.name;
        response.result.data[i].salesName = response.result.data[i].sales.name;
      }
      $scope.listReportData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $rootScope.$on('requestFetchData', function() {
   getCreditInvoiceReport($scope.requiredData);
  })

})
