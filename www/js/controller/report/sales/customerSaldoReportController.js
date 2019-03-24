distributionApp.controller('customerSaldoReportController', function($scope, $rootScope, $reportService, $myCookies, $customerService){
    var accessToken = $myCookies.get("accessToken");

    $scope.requiredData = {
        limit: 10,
        offset: 0,
        customer: "",
        selectedCustomer: null,
        export: false
    }

    setTimeout(() => { $scope.init(); }, 90);

    $scope.init = function(){
        getCustomerList();
        getCustomerSaldo($scope.requiredData);
    }

    function getCustomerList(){
        $customerService.get.customer().then(response => {
            console.log(response);
            $scope.customerList = response.result;
            $scope.customerList.splice(0, 0, {id: "", name: "-- Pilih Customer --"});
            $scope.requiredData.selectedCustomer = $scope.customerList[0];
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }
    $scope.changeCustomer = function(data){
        $scope.requiredData.customer = data.id;
    }
    function getCustomerSaldo(data){
        $reportService.get.customerSaldo(data).then(response => {
            console.log(response);
            $scope.listReportData = response.result.data;
            $scope.totalRows = response.result.row;
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }

    $scope.headings = [
        {name: "Nama Customer"},
        {name: "Saldo"}
    ];

    $scope.exportToExcel = function(){
        location.href = api.url + "report/customer/saldo?accessToken=" + accessToken + "&export=true";
    }

    $scope.viewReport = function(){
        $scope.requiredData.offset = 0;
        getCustomerSaldo($scope.requiredData);
    }
    $scope.$on('requestFetchData', function() {
		getCustomerSaldo($scope.requiredData);
	});
});