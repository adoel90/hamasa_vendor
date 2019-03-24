	distributionApp.controller('salesOrderController', function($scope, $rootScope,
	$salesService, $modalService, $timeout, $window, $myCookies) {

	'use strict';
	var accessToken = $myCookies.get("accessToken");

	$scope.salesOrder = {
		requiredData: {
			limit: 10,
			offset: 0,
			id: '',
			date: '',
			customer_name: '',
			sales_name: '',
			s_date:	'',
			e_date: ''
		},
		headings: [
			{ name: 'Nomor SO' },
			{ name: 'Tanggal SO' },
			{ name: 'Nama Customer' },
			{ name: 'Total Invoice'},
			{ name: 'Nama Sales' },
			{ name: 'Status SO' }
		],
		totalRows: 0
	}

	$scope.searchFilters = [
		{ by: 'customer_name', name: 'Nama Customer', placeholder: 'Masukkan nama customer' },
		{ by: 'id', name: 'ID Sales Order', placeholder: 'Masukkan ID Sales Order' },
		{ by: 'date', name: 'Tanggal Sales Order', placeholder: 'Masukkan tanggal Sales Order' },
		{ by: 'sales_name', name: 'Nama Sales', placeholder: 'Masukkan nama sales' },
		{ by: 'range_date', name: 'Range Tanggal' }
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}

	$scope.btnName = "Buat Sales Order";
	
	$scope.redirectToCreateNewData = function(){
		location.href = "/sales/salesorder/createnewsalesorder";
	}

	$scope.doSearchFilter = function(val, type) {
		$scope.salesOrder.requiredData.offset = 0;
		switch(type) {
			case 'id': {
				$scope.salesOrder.requiredData.id = val;
				$scope.salesOrder.requiredData.date = '';
				$scope.salesOrder.requiredData.customer_name = '';
				$scope.salesOrder.requiredData.sales_name = '';
				$scope.salesOrder.requiredData.s_date = '';
				$scope.salesOrder.requiredData.e_date = '';
				break;
			}
			case 'date': {
				$scope.salesOrder.requiredData.id = '';
				$scope.salesOrder.requiredData.date = val;
				$scope.salesOrder.requiredData.customer_name = '';
				$scope.salesOrder.requiredData.sales_name = '';
				$scope.salesOrder.requiredData.s_date = '';
				$scope.salesOrder.requiredData.e_date = '';
				break;
			}
			case 'customer_name': {
				$scope.salesOrder.requiredData.id = '';
				$scope.salesOrder.requiredData.date = '';
				$scope.salesOrder.requiredData.customer_name = val;
				$scope.salesOrder.requiredData.sales_name = '';
				$scope.salesOrder.requiredData.s_date = '';
				$scope.salesOrder.requiredData.e_date = '';
				break;
			}
			case 'sales_name': {
				$scope.salesOrder.requiredData.id = '';
				$scope.salesOrder.requiredData.date = '';
				$scope.salesOrder.requiredData.customer_name = '';
				$scope.salesOrder.requiredData.sales_name = val;
				$scope.salesOrder.requiredData.s_date = '';
				$scope.salesOrder.requiredData.e_date = '';
				break;
			}
		}

		$rootScope.$broadcast('requestPaginationUpdate');

		getSalesOrderList();
	}


	$scope.init = function() {
		getSalesOrderList();
	}

	$scope.convertItemStatus = function(status) {
		switch(status) {
			case 0: {
				return 'Not completed';
				break;
			}
			case 1: {
				return 'Completed';
				break;
			}
		}
	}

	$timeout($scope.init, 50);

	$rootScope.$on('requestFetchData', function() {
		getSalesOrderList();
	})

	function getSalesOrderList() {
		$salesService.get.salesOrderList($scope.salesOrder.requiredData)
			.then(function(response) {
				$scope.salesOrder.salesOrderList = response.result.data;
				$scope.salesOrder.totalRows = response.result.row;
				console.log(response.result);
				$scope.$apply();

				console.log($scope.salesOrder);
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	$scope.exportToExcel = function(){
		location.href = api.url + "report/original/sales/order?accessToken=" + accessToken + '&id=' + $scope.salesOrder.requiredData.id + '&date=' + $scope.salesOrder.requiredData.date + '&customer_name=' + $scope.salesOrder.requiredData.customer_name + '&sales_name=' + $scope.salesOrder.requiredData.sales_name + "&export=" + true + '&s_date=' + $scope.salesOrder.requiredData.s_date + '&e_date=' + $scope.salesOrder.requiredData.e_date;
	}

})
