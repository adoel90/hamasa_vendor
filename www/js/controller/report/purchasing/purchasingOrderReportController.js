distributionApp.controller('purchasingOrderReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
    var accessToken = $myCookies.get('accessToken');
    $scope.requiredData = {
        date: $moment(new Date()).format('YYYY-MM-DD')
    }

    $scope.viewReport = function(){
        getPoReport($scope.requiredData);
    }

    $scope.headings = [
        {name: "PO ID"},
        {name: "Nama Supplier"},
        {name: "Nama Barang"},
        {name: "Qty"},
        {name: "Harga"},
        {name: "Subtotal"}
    ]

    function getPoReport(data){
        $reportService.get.purchaseOrderReport(data).then(response => {
            console.log(response);
            $scope.reportData = response.result;
            $scope.$apply();
        })  
        .catch(error => {
            console.log(error);
        })
    }
    
    setTimeout(() => { getPoReport($scope.requiredData); }, 90);

    $scope.printReport = function(){
        location.href = api.url + 'report/purchase/order?accessToken=' + accessToken + '&date=' + $scope.requiredData.date + '&print=true';
    }
});