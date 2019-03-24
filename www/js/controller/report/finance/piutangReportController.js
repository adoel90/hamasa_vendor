distributionApp.controller('piutangReportController', function($scope, $rootScope, $reportService, $moment, $myCookies, $customerService){
    var accessToken = $myCookies.get("accessToken");

    $scope.headings = [
        {name: "Customer"},
        {name: "Inv ID"},
        {name: "Tgl Inv"},
        {name: "Tgl Jtp"},
        {name: "Tempo"},
        {name: "Total"},
        {name: "Keterangan"}
    ];

    $scope.paymentList = [
        {id: "", name: "-- Pilih Tipe Pembayaran --"},
        {id: 1, name: "Tunai"},
        {id: 2, name: "Kredit"}
    ];

    $scope.requiredData = {
        limit: 10,
        offset: 0,
        start_date: $moment(new Date()).format('YYYY-MM-DD'),
        end_date: "",
        c_name: "",
        print: false,
        payment: "",
        selectedCustomer: null,
        selectedPayment: $scope.paymentList[0]
    }

    $scope.viewReport = function(){
        $scope.requiredData.offset = 0;
        $scope.requiredData.end_date = $scope.requiredData.start_date;
        getPiutangCustomerReport($scope.requiredData);
    }

    $scope.changePayment = function(item){
        $scope.requiredData.payment = item.id;
    }

    function getPiutangCustomerReport(data){
        $reportService.get.piutangCustomer(data).then(response => {
            console.log(response);
            $scope.listReportData = response.result.data;
            $scope.totalRows = response.result.row;
            $scope.$apply();

        })
        .catch(error => {
            console.log(error);
        })
    }

    setTimeout(() => { $scope.init(); }, 100);

    $scope.init = function(){
        getCustomerList();
    }

    function getCustomerList() {
		$customerService.get.customer()
			.then(function(response) {
                $scope.customerList = response.result;
                $scope.customerList.splice(0, 0, {id: "", name: "-- Pilih Customer --"});
                $scope.requiredData.selectedCustomer = $scope.customerList[0];
				$scope.$apply();
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

    $scope.changeCustomer = function(item) {
        if(item.id == ""){ $scope.requiredData.c_name = ""}
        else { $scope.requiredData.c_name = item.name; }
    }

    $rootScope.$on('requestFetchData', function() {
        getPiutangCustomerReport($scope.requiredData);
    });

    $scope.printReport = function(){
        location.href = api.url + 'report/customer/piutang?accessToken=' + accessToken + '&start_date=' + $scope.requiredData.start_date + '&end_date=' + $scope.requiredData.end_date + '&c_name=' + $scope.requiredData.c_name + '&print=true';
    }
    
});