distributionApp.controller('poReportController', function($scope, $rootScope, $reportService, $moment, $myCookies, $categoryService){
    var accessToken = $myCookies.get('accessToken');
    $scope.requiredData = {
        limit: 10,
        offset: 0,
        start_date: $moment(new Date()).format('YYYY-MM-DD'),
        end_date: $moment(new Date()).format('YYYY-MM-DD'),
        selectedCategory: null,
        category: "",
        print: false,
        export: false
    }

    $scope.headings = [
        {name: "Tgl"},
        {name: "PO ID"},
        {name: "Supplier"},
        {name: "Barang"},
        {name: "BTB ID"},
        {name: "Qty"},
        {name: "Berat"},
        {name: "Harga"}
    ];

    setTimeout(() => {
        $scope.init();
    }, 100);

    $scope.init = function(){
        getAllCategory();
    }

    function getAllCategory(){
        $categoryService.get.allCategory().then(response => {
            console.log(response);
            $scope.listCategory = response.result;
            $scope.listCategory.splice(0, 0, {id: "", name: "-- Pilih Category --"});
            $scope.requiredData.selectedCategory = $scope.listCategory[0];
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }   
    
    $scope.changeCategory = function(data){
        if(data.id == ""){ $scope.requiredData.category = ""; }
        else{ $scope.requiredData.category = data.name; }
    }

    $scope.viewReport = function(){
        getPoReport($scope.requiredData);
    }
    
    function getPoReport(data){
        $reportService.get.purchasingReport(data)
        .then(response => {
            console.log(response);
            $scope.listReportData = response.result.data;
            $scope.totalRows = response.result.row;
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }

    $scope.printReport = function(){
        location.href = api.url + 'report/purchase/order?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&start_date=' + $scope.requiredData.start_date + '&end_date=' + $scope.requiredData.end_date + '&category=' +  $scope.requiredData.category + '&print=true' + '&export=' + $scope.requiredData.export;
    }

    $scope.exportToExcel = function(){
        location.href = api.url + 'report/purchase/order?accessToken=' + accessToken + '&limit=' + $scope.requiredData.limit + '&offset=' + $scope.requiredData.offset + '&start_date=' + $scope.requiredData.start_date + '&end_date=' + $scope.requiredData.end_date + '&category=' +  $scope.requiredData.category + '&print=false' + '&export=true';
    }

});