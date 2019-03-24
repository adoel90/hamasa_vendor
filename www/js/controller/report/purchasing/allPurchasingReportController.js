distributionApp.controller('allPurchasingReportController', function($scope, $rootScope, $reportService, $moment, $myCookies, $categoryService){
    var accessToken = $myCookies.get("accessToken");
    $scope.requiredData = {
        start_date: $moment(new Date()).format('YYYY-MM-DD'),
        end_date: $moment(new Date()).format('YYYY-MM-DD'),
        export: false
    }

    $scope.exportToExcel = function(){
        location.href = api.url + "report/pembelian?accessToken=" + accessToken + "&start_date=" + $scope.requiredData.start_date + "&end_date=" + $scope.requiredData.end_date + "&export=true";
    }
});