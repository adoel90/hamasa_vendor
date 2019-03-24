distributionApp.controller('eInvoiceController', function($scope, $rootScope, $myCookies ){
  var accessToken = $myCookies.get("accessToken");
  $scope.requiredData = {
    start_date: '',
    end_date: '',
    invoice: '',
    tax: '',
    s_date: '',
    e_date: ''
  }

  $scope.searchFilters = [
		{by: 'range_date', name: 'Range Tanggal'}
  ]
  
  $scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}

  $scope.displayEInvoice = function(){
    location.href = api.url + "tax/invoice/export?accessToken=" + accessToken + "&start_date=" + $scope.requiredData.start_date + "&end_date=" + $scope.requiredData.end_date + "&invoice=" + $scope.requiredData.invoice + "&tax=" + $scope.requiredData.tax;
  }

  $scope.exportToExcel = function(){
    location.href = api.url + 'report/finance/invoice/list?accessToken=' + accessToken + '&export=' + true + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date;
  }

});
