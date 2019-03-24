distributionApp.controller('accountReceivablesDailyReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
    var accessToken = $myCookies.get("accessToken");
    $scope.requiredData = {
        date: $moment(new Date()).format('YYYY-MM-DD'),
        export: false
    }

    $scope.headings = [
        {name: "SO ID"},
        {name: "Customer"},
        {name: "Sales"},
        {name: "Nama Barang"},
        {name: "Quantity"},
        {name: "Harga"},
        {name: "Subtotal"},
        {name: "Total"},
        {name: "Tunai"},
        {name: "Cek/Giro"},
        {name: "Transfer"},
        {name: "Tanda Terima"},
        {name: "Belum Bayar"}
    ];
    
    $scope.viewReport = function(){
        getAccountReceivablesDaily($scope.requiredData);
    }

    function getAccountReceivablesDaily(data){
        $reportService.get.accountReceivablesDailyReport(data).then(response => {
            console.log(response);
            $scope.listReportData = response.result.data;
            $scope.totalCash = response.result.total_cash;
            $scope.totalGiro = response.result.total_giro;
            $scope.totalRemain = response.result.total_remain;
            $scope.totalSaldoUsed = response.result.total_saldo_used;
            $scope.totalSubtotal = response.result.total_subtotal;
            $scope.totalTotal = response.result.total_total;
            $scope.totalTrf = response.result.total_trf;
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })      
    }

    $scope.exportToExcel = function(){
        location.href = api.url + 'report/accounts/receivable/daily?accessToken=' + accessToken + '&date=' + $scope.requiredData.date + '&export=true';
    }
    
});