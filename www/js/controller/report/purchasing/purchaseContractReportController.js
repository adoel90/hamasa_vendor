distributionApp.controller('purchaseContractReportController', function($scope, $rootScope, $reportService, $moment, $myCookies, $supplierService){
    var accessToken = $myCookies.get('accessToken');
    $scope.requiredData = {
        limit: 10,
        offset: 0,
        end_date: $moment(new Date()).format('YYYY-MM-DD'),
        selectedSupplier: null,
        supplier: "",
        pc_id: "",
        print: false,
        export: false
    }

    $scope.headings = [
        {name: "Tgl"},
        {name: "PO ID"},
        {name: "BTB ID"},
        {name: "Nama Barang"},
        {name: "Qty"},
        {name: "Berat"},
        {name: "Tonase"},
        {name: "Harga"},
        {name: "Total"}
    ];

    setTimeout(() => {
        $scope.init();
    }, 100);

    $scope.init = function(){
        getAllSupplier();
    }

    function getAllSupplier(){
        $supplierService.get.allSuppliers().then(response => {
            console.log(response);
            $scope.listSupplier = response.result;
            $scope.listSupplier.splice(0, 0, {id: "", name: "-- Pilih Supplier --"});
            $scope.requiredData.selectedSupplier = $scope.listSupplier[0];
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }
    $scope.changeSupplier = function(item){
        $scope.requiredData.supplier = item.id;
    }
    
    $scope.viewReport = function(){
        getPurchaseContractReport($scope.requiredData);
    }
    
    function getPurchaseContractReport(data){
        $reportService.get.purchaseContractReport(data)
        .then(response => {
            console.log(response);
            $scope.reportData = response.result;
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }

    $scope.exportToExcel = function(){
        location.href = api.url + 'report/purchase/contract?accessToken=' + accessToken + '&end_date=' + $scope.requiredData.end_date + '&supplier=' + $scope.requiredData.supplier + '&pc_id=' + $scope.requiredData.pc_id + '&print=' + $scope.requiredData.print + '&export=true';
    }

});