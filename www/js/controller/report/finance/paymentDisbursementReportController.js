distributionApp.controller('paymentDisbursementReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
  var accessToken = $myCookies.get("accessToken");

  $scope.requiredData = {
    limit: 10,
    offset: 0,
    date: $moment(new Date()).format('YYYY-MM-DD'),
    print: false
  }

  $scope.headings = [
    {name: "Customer"},
    {name: "No Faktur"},
    {name: "Tgl Jatuh Tempo"},
    {name: "Jenis Bayar"},
    {name: "Bank"},
    {name: "No Bukti"},
    {name: "Jumlah Bayar"}
  ];

  setTimeout(()=>{
    $scope.init();
  }, 150);

  $scope.init = function(){
    getPaymentDisbursementReport($scope.requiredData);
  }

  function getPaymentDisbursementReport(data){
    $reportService.get.paymentDisbursementReport(data).then(response => {
      console.log(response);
      $scope.paymentDisbursementReport = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $scope.doPrint = function(){
    location.href = api.url + 'report/payment/disbursement?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&end_date=' + $scope.requiredData.date + '&print=true';
  }

  $scope.viewPaymentDisbursementReport = function(){
    $scope.requiredData.offset = 0;
    getPaymentDisbursementReport($scope.requiredData);
  }

  $rootScope.$on("requestFetchData", function(){
    getPaymentDisbursementReport($scope.requiredData);
  })
});
