distributionApp.controller('itemSoldReportController', function($scope, $rootScope, $moment, $reportService, $myCookies){
    var accessToken = $myCookies.get('accessToken');

    $scope.requiredData = {
        date: $moment(new Date()).format('YYYY-MM-DD'),
        print: false
    }

    $scope.headings = [
        {name: "Gudang"},
        {name: "Nama Barang"},
        {name: "Stok Plan Terjual"},
        {name: "Stok Plan Akhir"},
        {name: "Stok Aktual Akhir"}
    ];

    $scope.viewReport = function(){
        getItemSoldReport($scope.requiredData);
    }

    function getItemSoldReport(data){
        $reportService.get.itemSoldReport(data).then(response => {
            console.log(response);
            $scope.reportData = response.result;
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }

    setTimeout(() => { getItemSoldReport($scope.requiredData); }, 90);
    $scope.printReport = function(){
        console.log('abcdefg');
        location.href = api.url + 'report/item/sold?accessToken=' + accessToken + '&date=' + $scope.requiredData.date + '&print=true';
    }

});