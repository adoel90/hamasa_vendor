distributionApp.controller('dailyInvoiceReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
    var accessToken = $myCookies.get("accessToken");
    
    $scope.requiredData = {
        start_date: $moment(new Date()).format('YYYY-MM-DD'),
        end_date: $moment(new Date()).format('YYYY-MM-DD'),
        print: false,
        method: null,
        selectedPaymentMethod: null
    }

    $scope.viewReport = function(){
        getDailyInvoiceReport($scope.requiredData);
    }

    function getDailyInvoiceReport(data){
        $reportService.get.dailyInvoiceReport(data).then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
    }

    $scope.printReport = function(){
        location.href = api.url + 'report/invoice/daily?accessToken=' + accessToken + '&start_date' + $scope.requiredData.start_date + '&end_date=' + $scope.requiredData.end_date + '&payment=' + $scope.requiredData.method + '&print=true';
    }

});