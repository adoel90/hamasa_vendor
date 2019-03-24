distributionApp.controller('salesDealReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
    var accessToken = $myCookies.get("accessToken");
    
    $scope.headings = [
      {name: "SO ID"},
      {name: "Nama Customer"},
      {name: "Sales"},
      {name: "Nama Barang"},
      {name: "Qty"},
      {name: "Harga"},
      {name: "Subtotal"},
      {name: "Total"},
      {name: "Tunai"},
      {name: "Giro"},
      {name: "Transfer"},
      {name: "Belum Bayar"}
    ];
  
   $scope.requiredData = {
      date: $moment(new Date()).format('YYYY-MM-DD'),
      export: false
    }
  
    setTimeout(()=>{ $scope.init(); },120);
  
    $scope.init = function(){
      getSoReport($scope.requiredData);
    }
  
    function getSoReport(data){
      $reportService.get.sellingReport(data).then(response => {
        console.log(response);
        
        $scope.listReportData = response.result.data;
        $scope.totalSubtotal = response.result.total_subtotal;
        $scope.totalTotal = response.result.total_total;
        $scope.totalCash = response.result.total_cash;
        $scope.totalTrf = response.result.total_trf;
        $scope.totalGiro = response.result.total_giro;
        $scope.totalRemain = response.result.total_remain;
        $scope.$apply();
      })
      .catch(error => {
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    }
  
    $scope.viewReport = function(){
      $scope.requiredData.offset = 0;
      getSoReport($scope.requiredData);
    }
  
    $scope.exportToExcel = function(){
      location.href = api.url + 'report/selling?accessToken=' + accessToken + '&date=' + $scope.requiredData.date + '&export=true';
    }
  
    $rootScope.$on('requestFetchData', function() {
     $scope.init();
    })
  
  });
  