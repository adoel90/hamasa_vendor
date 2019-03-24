distributionApp.controller('warehouseMutationReportController', function($scope, $rootScope, $warehouseService, $reportService, $moment, $myCookies){
    var accessToken = $myCookies.get("accessToken");

    $scope.headings = [
        {name: "Asal"},
        {name: "Tgl Mutasi"},
        {name: "ID Mutasi"},
        {name: "Nama Barang"},
        {name: "Out"},
        {name: "Tujuan"},
        {name: "Tgl BTB"},
        {name: "ID BTB"},
        {name: "Nama Barang"},
        {name: "In"},
        {name: "Keterangan"},
        {name: "Status"}
    ];    

    $scope.requiredData = {
        limit: "",
        offset: "",
        warehouse_id: "",
        start_date: $moment(new Date()).format('YYYY-MM-DD'),
        end_date: $moment(new Date()).format('YYYY-MM-DD'),
        print: false
    }

    $scope.viewReport = function(){
        $scope.requiredData.offset = 0;
        getWarehouseMutationReport($scope.requiredData);
    }

    function getWarehouseMutationReport(data){
        $reportService.get.warehouseMutationReport(data).then(response => {
            console.log(response);
            $scope.listReportData = response.result;
            $scope.$apply();
        })
        .catch(error => {
            $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
    }

    $scope.printReport = function(){
        location.href = api.url + 'report/mutation/warehouse?accessToken=' + accessToken + '&start_date=' + $scope.requiredData.start_date + '&end_date=' + $scope.requiredData.end_date + '&mutation_from=' + $scope.requiredData.warehouse_id + '&print=true';
    }
});