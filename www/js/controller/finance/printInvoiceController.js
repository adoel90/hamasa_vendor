distributionApp
	.controller('printInvoiceController', printInvoiceController)

function printInvoiceController($scope, $rootScope, $modalService, $salesService,
	$invoiceService, $timeout, $window, $myCookies) {
	'use strict';

	$scope.printInvoice = {
		requiredData: {
			id: '',
			change: false,
			s_date: '',
			e_date: ''
		}
	}

	var accessToken = $myCookies.get('accessToken');
	
	$scope.searchFilters = [
		{by: 'range_date', name: 'Range Tanggal'}
	]

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}
	
	$scope.openSalesOrderList = function(soId) {
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/addSalesOrder.html',
			size: 'lg'
		}

		$modalService.open(modalOptions)
			.then(function(response) {
				$scope.salesOrderList = {
					requiredData: {
						limit: 10,
						offset: 0,
						id: '',
						date: '',
						customer_name: '',
						sales_name: '',
						s_date: '',
						e_date: ''
					},
					searchFilters: [
						{ by: 'id', name: 'Nomor Sales Order', placeholder: 'Masukkan nomor Sales Order' },
						{ by: 'date', name: 'Tanggal', placeholder: 'Masukkan tanggal' },
						{ by: 'customer_name', name: 'Nama Customer', placeholder: 'Masukkan nama customer' },
						{ by: 'sales_name', name: 'Nama Sales', placeholder: 'Masukkan nama sales' },
					],
					headings: [
						{ name: 'Nomor SO' },
						{ name: 'Tanggal SO' },
						{ name: 'Nama Customer' },
						{ name: 'Nama Sales' },
						{ name: 'Status SO' }
					]
				}

				$scope.salesOrderList.selectedFilter = {
					item: $scope.salesOrderList.searchFilters[0]
				}

				$scope.doSearchFilter = function(val, type) {
					switch(type) {
						case 'id': {
							$scope.salesOrderList.requiredData.id = val;
							$scope.salesOrderList.requiredData.date = '';
							$scope.salesOrderList.requiredData.customer_name = '';
							$scope.salesOrderList.requiredData.sales_name = '';

							break;
						}
						case 'date': {
							$scope.salesOrderList.requiredData.id = '';
							$scope.salesOrderList.requiredData.date = val;
							$scope.salesOrderList.requiredData.customer_name = '';
							$scope.salesOrderList.requiredData.sales_name = '';
							break;
						}
						case 'customer_name': {
							$scope.salesOrderList.requiredData.id = '';
							$scope.salesOrderList.requiredData.date = '';
							$scope.salesOrderList.requiredData.customer_name = val;
							$scope.salesOrderList.requiredData.sales_name = '';
							break;
						}
						case 'sales_name': {
							$scope.salesOrderList.requiredData.id = '';
							$scope.salesOrderList.requiredData.date = '';
							$scope.salesOrderList.requiredData.customer_name = '';
							$scope.salesOrderList.requiredData.sales_name = val;
							break;
						}
					}

					$rootScope.$broadcast('requestPaginationUpdate');

					getSalesOrderList();
				}

				$scope.chooseItem = function(item) {
					// console.log(item);
					// $scope.printInvoice.requiredData.id = item.id;
					// $scope.printInvoice.requiredData.change
					$scope.printInvoice.so_id= item.id;
					$modalService.close();
					$timeout(getInvoiceSalesOrderDetail, 100);
				}

				$rootScope.$on('requestFetchData', function() {
					getSalesOrderList();
				})

				$scope.modalInit = function() {
					getSalesOrderList();
				}

				$timeout($scope.modalInit, 50);

				function getSalesOrderList() {
					$salesService.get.salesOrderList($scope.salesOrderList.requiredData)
						.then(function(response) {
							console.log(response.result);
							angular.extend($scope.salesOrderList, response.result);
							// console.log($scope.salesOrderList);
							$scope.$apply();
						})
				}
			})
	}

	$scope.printSelectedInvoice = function() {
		// console.log($scope.printInvoice.requiredData);
		
		$invoiceService.get.printInvoice($scope.printInvoice.requiredData)
		.then(response => {
			if(response.responseJSON){
				$rootScope.triggerModal(response.responseJSON.message, "Error", "danger", "");
			}
			else{
				$invoiceService.redirect.printInvoice($scope.printInvoice.requiredData);
			}

		})
		.catch(error => {
			$rootScope.triggerModal(response.responseJSON.message, "Error", "danger", "");
		})
	}

	function getInvoiceSalesOrderDetail() {
		console.log($scope.printInvoice.so_id);

		$salesService.get.salesOrderInvoiceDetail($scope.printInvoice.so_id)
			.then(function(response) {
				console.log(response);
				$scope.salesOrderInvoiceDetail = response.result;
				$scope.printInvoice.requiredData.id = $scope.salesOrderInvoiceDetail.id;
				$scope.printInvoice.requiredData.change = $scope.salesOrderInvoiceDetail.inv_change;
				console.log($scope.printInvoice.requiredData)

				$scope.$apply();
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	$scope.exportToExcel = function(){
		location.href = api.url + 'report/finance/invoice/list?accessToken=' + accessToken + '&export=' + true + '&s_date=' + $scope.printInvoice.requiredData.s_date + '&e_date=' + $scope.printInvoice.requiredData.e_date;
	}
}
