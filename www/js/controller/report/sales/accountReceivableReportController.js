distributionApp.controller('accountReceivableReportController', function($scope, $rootScope, $reportService, $moment, $myCookies, $customerService){
    var accessToken = $myCookies.get("accessToken");
    $scope.requiredData = {
        limit: 10,
        offset: 0,
        start_date: $moment(new Date()).format('YYYY-MM-DD'),
        end_date: $moment(new Date()).format('YYYY-MM-DD'),
        date: $moment(new Date()).format('YYYY-MM-DD'),
        print: false,
        detail: true,
        showDetailReport: false,
        selectedCustomer: null,
        c_name: ""
    }

    $scope.customerList = [];

    $scope.headings = [
        {name: "Tipe"},
        {name: "No Invoice"},
        {name: "Nama Customer"},
        {name: "Nama Barang"},
        {name: "Qty Order"},
        {name: "Harga / item"},
        {name: "Subtotal"},
        {name: "Total Piutang"},
        {name: "Pelunasan Piutang"},
        {name: "Sisa Piutang"},
        {name: "Status"}
    ];

    $scope.headingsReceivableDetail = [
        {name: "Tipe"},
        {name: "No Invoice"},
        {name: "Nama Customer"},
        {name: "Nama Barang"},
        {name: "Qty Order"},
        {name: "Harga / item"},
        {name: "Subtotal"},
        {name: "Total Piutang"},
        {name: "Jumlah Pelunasan"},
        {name: "Metode Pelunasan"},
        {name: "Sisa Piutang"},
        {name: "Status"}
    ];

    setTimeout(() => {
        $scope.init();
    }, 90);
    
    $scope.init = function(){
        getCustomerList();
    }

    function getCustomerList() {
		$customerService.get.customer()
			.then(function(response) {
                $scope.customerList = response.result;
                $scope.customerList.splice(0, 0, {id: null, name: ""});
                $scope.requiredData.selectedCustomer = $scope.customerList[0];
				$scope.$apply();

				$timeout(setInitialCustomer	, 50);
			})
			.catch(function(error) {
				console.warn(error);
			})
    }

    $scope.changeCustomer = function(item) {
		$scope.requiredData.c_name = item.name;
	}
    
    $scope.viewReport = function(){
        setTimeout(() => { getAccountReceivablesReport($scope.requiredData) }, 90);
    }

    function getAccountReceivablesReport(data){
        $reportService.get.accountReceivablesReport(data).then(response => {
            console.log(response);
            $scope.reportData = response.result;
            $scope.$apply();
        })
        .catch(error => {
            $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
    }

    setTimeout(() => { getAccountReceivablesReport($scope.requiredData); }, 90);
    
    $scope.printReport = function(){
        location.href = api.url + 'report/accounts/receivable?accessToken=' + accessToken + '&date=' + $scope.requiredData.date + '&print=true' + '&detail=' + $scope.requiredData.detail;
    }
});