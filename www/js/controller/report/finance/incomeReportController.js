distributionApp.controller('incomeReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
  var accessToken = $myCookies.get("accessToken");
  $scope.headings = [
    {name: "Tanggal"},
    {name: "Nama Customer"},
    {name: "Metode Pelunasan"},
    {name: "No Invoice"},
    {name: "DPP"},
    {name: "Total Invoice"},
    {name: "Jmlh Pelunasan"},
    {name: "Materai"},
    {name: "Total yg Diterima"},
    {name: "Deposit"},
    {name: "Total Pelunasan"}
  ];

  $scope.cols = [
    {name: "invoiceId", type: "text"},
    {name: "invoiceTax", type: "text"},
    {name: "customerName", type: "text"},
    {name: "invoiceTotal", type: "number"},
    {name: "invoiceStamp", type: "number"},
    {name: "salesName", type: "text"},
    {name: "paymentMethod", type: "text"},
    {name: "paymentTotal", type: "number"}
  ];

  $scope.paymentMethodList = [
    {id: "", name: "-- Pilih Metode Pembayaran --"},
    {id: 1, name: "Transfer"},
    {id: 0, name: "Tunai"},
    {id: 2, name: "Cek"},
    {id: 3, name: "Giro"},
 ];

  $scope.requiredData = {
    limit: "",
    offset: "",
    start_date: $moment(new Date()).format('YYYY-MM-DD'),
    end_date: $moment(new Date()).format('YYYY-MM-DD'),
    print: false,
    method: "",
    selectedPaymentMethod: $scope.paymentMethodList[0]
  }

  $scope.listReportData = null;
  

  $scope.viewReport = function(){
    $scope.requiredData.offset = 0;
    getIncomeReport($scope.requiredData);
  }

  $scope.changePaymentMethod = function(data){
    $scope.requiredData.method = data.id;
  }

  $scope.exportIntoExcel = function(){
    location.href = api.url + "export/accounts/receivable?accessToken=" + accessToken + '&start_date=' + $scope.requiredData.start_date + '&end_date='+ $scope.requiredData.end_date + '&print=' + $scope.requiredData.print + '&pay_method=' + $scope.requiredData.method;
  }

  function getIncomeReport(data){
    $reportService.get.accountReceivablesReport(data).then(response => {
      console.log(response);
      $scope.incomeReportData = response.result.data;
      $scope.cash_in_total = response.result.cash_in_total;
      $scope.cash_received_total = response.result.cash_received_total;
      $scope.$apply();
    })
    .catch(error => {
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
    // $reportService.get.incomeReport(data).then(response => {
    //   console.log(response);
    //   $scope.incomeReportData = response.result.data;
    //   $scope.totalRows = response.result.row;
    //   $scope.totalInvoice = response.result.total_inv;
    //   $scope.totalReceived = response.result.paid_total;
    //   $scope.$apply();
    // })
    // .catch(error => {
    //   console.log(error);
    //   $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    // })

  }

  $rootScope.$on("requestFetchData", function(){
    getIncomeReport($scope.requiredData);
  })

  $scope.printReport = function(){
    location.href = api.url + "report/accounts/receivable?accessToken=" + accessToken + '&start_date=' + $scope.requiredData.start_date + '&end_date='+ $scope.requiredData.end_date + '&print=true' + '&detail=' + $scope.requiredData.detail + '&c_name=' + $scope.requiredData.c_name + '&pay_method=' + $scope.requiredData.method;
  }

})
