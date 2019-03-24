distributionApp.controller('agingPiutangReportController', function($scope, $rootScope, $reportService, $moment, $myCookies, $customerService){
    var accessToken = $myCookies.get("accessToken");

    $scope.headings = [
        {name: "Customer"},
        {name: "Inv ID"},
        {name: "Tgl Inv"},
        {name: "Tgl Jtp"},
        {name: "Tempo"},
        {name: "Total"},
        {name: "Blm Jtp"},
        {name: "1-30"},
        {name: "31-60"},
        {name: "61-90"},
        {name: "91-120"},
        {name: ">120"}
    ];

    $scope.requiredData = {
        limit: 10,
        offset: 0,
        start_date: $moment(new Date()).format('YYYY-MM-DD'),
        end_date: "",
        c_name: "",
        export: false,
        selectedCustomer: null
    }
    
    $scope.viewReport = function(){
        $scope.requiredData.end_date = $scope.requiredData.start_date;
        $scope.requiredData.offset = 0;
        getAgingPiutangReport($scope.requiredData);
    }

    function getAgingPiutangReport(data){
        $reportService.get.agingPiutangReport(data).then(response => {
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
        getAgingPiutangReport($scope.requiredData);
    });

    $scope.exportIntoExcel = function(){
        location.href = api.url + 'report/aging/piutang?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&start_date=' + $scope.requiredData.start_date + '&end_date=' + $scope.requiredData.end_date + '&c_name=' + $scope.requiredData.c_name + '&export=true';
    }

});