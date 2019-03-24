distributionApp.controller('customerCreditAnalysisReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
  var accessToken = $myCookies.get("accessToken");
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    start_date: $moment(new Date()).format('YYYY-MM-DD'),
    end_date: '',
    print: false
  }

  $scope.headings = [
    {name: "Customer"},
    {name: "No Faktur"},
    {name: "Tanggal Faktur"},
    {name: "Tanggal Jatuh Tempo"},
    {name: "Tempo"},
    {name: "Jumlah"},
    {name: "Lewat Hari"},
    {name: "Keterangan"}
  ];

  $scope.cols = [
    {name: "customerName", type: "text"},
    {name: "invoiceId", type: "text"},
    {name: "invoiceDate", type: "text"},
    {name: "invoiceDueDate", type: "text"},
    {name: "invoiceTempo", type: "number"},
    {name: "invoiceTotal", type: "number"},
    {name: "surpass", type: "number"},
    {name: "note", type: "text"}
  ];

  $scope.listReportData = null;

  setTimeout(()=>{ $scope.init(); }, 150);

  $scope.viewReport = function(){
    $scope.requiredData.offset = 0;
    getCustomerCreditAnalysisReport($scope.requiredData);
  }

  $scope.init = function(){
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);
    setTimeout(()=>{
      $scope.requiredData.end_date = $moment(tomorrow).format('YYYY-MM-DD');
      getCustomerCreditAnalysisReport($scope.requiredData);
    },100);
  }

  function getCustomerCreditAnalysisReport(data){
    $reportService.get.customerCreditAnalysis(data).then(response => {
      console.log(response);
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].customerName = response.result.data[i].customer.name;
        response.result.data[i].invoiceId = response.result.data[i].invoice.id;
        response.result.data[i].invoiceDate = response.result.data[i].invoice.date;
        response.result.data[i].invoiceDueDate = response.result.data[i].invoice.due_date;
        response.result.data[i].invoiceTempo = response.result.data[i].invoice.tempo;
        response.result.data[i].invoiceTotal = response.result.data[i].invoice.total;
        response.result.data[i].surpass = response.result.data[i].surpass ? response.result.data[i].surpass : 0;
        response.result.data[i].note = response.result.data[i].note ? response.result.data[i].note : '-';
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

  $rootScope.$on("requestFetchData", function(){
    getCustomerCreditAnalysisReport($scope.requiredData);
  })

  $scope.printReport = function(){
    location.href = api.url + 'report/analysis/credit?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&start_date=' + $scope.requiredData.start_date + '&end_date=' + $scope.requiredData.end_date + '&print=true';
  }
})
