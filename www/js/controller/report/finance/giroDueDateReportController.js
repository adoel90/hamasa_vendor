distributionApp.controller('giroDueDateReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
    var accessToken = $myCookies.get("accessToken");
    $scope.requiredData = {
        limit: 10,
        offset: 0,
        date: $moment(new Date()).format('YYYY-MM-DD'),
        print: false
    }

    $scope.headings = [
        {name: "Tujuan"},
        {name: "Tgl JTP"},
        {name: "No Cek / Giro"},
        {name: "Bank"},
        {name: "Customer"},
        {name: "Nilai"}
    ];

    setTimeout(()=>{
        $scope.init();
    }, 150);

    $scope.init = function(){
        getDueDateReport($scope.requiredData);
    }

    function getDueDateReport(data){
        $reportService.get.giroDueDate(data).then(response => {
            console.log(response);
            $scope.listReportData = response.result.data;
            $scope.totalRows = response.result.row;
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }

    $rootScope.$on("requestFetchData", function(){
        getDueDateReport($scope.requiredData);
    })

    $scope.doPrint = function(){
        location.href = api.url + 'report/payment/duedate?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&end_date=' + $scope.requiredData.date + '&print=true';
    }
});