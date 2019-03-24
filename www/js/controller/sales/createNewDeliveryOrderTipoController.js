distributionApp.controller('createNewDeliveryOrderTipoController', function($scope, $rootScope, $tipoService, $modalService,
	$window, $timeout) {

	'use strict';

	var selectedTipoId = routeParams.id;
	$rootScope.tipoId = encodeURIComponent(routeParams.id);
	$scope.deliveryOrderTipo = {
		requiredData: {
			warehouse_id: '',
			so_id: '',
			item: []
		}
	}

	$scope.saveChanges = function() {
		$tipoService.post.createDoTipo($scope.deliveryOrderTipo.requiredData)
			.then(function(response) {
				var succeedUrl = '/sales/tipo/tipoinfo/' + encodeURIComponent(routeParams.id);
				$rootScope.triggerModal("Delivery Order TIPO telah berhasil ditambahkan.", "Success", "success", succeedUrl);
			})
			.catch(function(error) {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
	}

	$scope.deleteItem = function(index){
		$scope.salesOrderDetail.item.splice(index, 1);
	}
	
	$scope.openSalesOrderList = function() {
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
						sales_name: ''
					},
					searchFilters: [
						{ by: 'id', name: 'Nomor Sales Order', placeholder: 'Masukkan nomor Sales Order' },
						{ by: 'date', name: 'Tanggal', placeholder: 'Masukkan tanggal' },
						{ by: 'customer_name', name: 'Nama Customer', placeholder: 'Masukkan nama customer' },
						{ by: 'sales_name', name: 'Nama Sales', placeholder: 'Masukkan nama sales' },
					],
					headings: [
						{ name: 'Nomor SO', size: 'sm' },
						{ name: 'Date' },
						{ name: 'Nama Customer' },
						{ name: 'Nama Sales' },
						{ name: 'Status' }
					]
				}

				$scope.salesOrderList.selectedFilter = {
					item: $scope.salesOrderList.searchFilters[0]
				}

				$scope.chooseItem = function(item) {
					$scope.deliveryOrderTipo.requiredData.so_id = item.id;
					$modalService.close();
					getSalesOrderDetail();
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

				$scope.modalInit = function() {
					getSalesOrderList();
				}

				$rootScope.$on('requestFetchData', function() {
					getSalesOrderList();
				})

				$timeout($scope.modalInit, 50);

				function getSalesOrderList() {
					$tipoService.get.salesOrderTipoList($scope.salesOrderList.requiredData)
						.then(function(response) {
							console.log(response);
							angular.extend($scope.salesOrderList, response.result);
							$scope.$apply();
							console.log($scope.salesOrderList);
						})
						.catch(function(error) {
							console.warn(error);
						})
				}
			});
	}

	function getSalesOrderDetail() {
		$tipoService.get.salesOrderTipoDetail($scope.deliveryOrderTipo.requiredData.so_id, false)
			.then(function(response) {
				$scope.salesOrderDetail = response.result;
				$scope.salesOrderDetail.headings = [
					{ name: 'Kategori' },
					{ name: 'Nama Barang' },
					{ name: 'Sisa Ambil', size: 'sm' },
					{ name: 'Jumlah Ambil', size: 'sm' },
					{ name: 'Keterangan' },
					{ name: 'Action' }
				];

				angular.forEach($scope.salesOrderDetail.item, function(item) {
					item.quantity_left = item.quantity;
					item.note = '';
					item.quantity = '';
				})

				$scope.deliveryOrderTipo.requiredData.warehouse_id = $scope.salesOrderDetail.warehouse.id;
				$scope.deliveryOrderTipo.requiredData.item = $scope.salesOrderDetail.item;

				$scope.$apply();
				console.log($scope.salesOrderDetail);
			})
			.catch(function(error) {
				var modalOptions = {
					scope: $scope
				}

				$modalService.alert(modalOptions)
					.then(function(response) {
						$scope.alert = {
							type: 'danger',
							title: 'Perhatian',
							message: error.responseJSON.message,
							button: [
								{ type: 'danger', text: 'Kembali' }
							]
						}

						$scope.doAction = function(index) {
							switch(index) {
								case 0: {
									$modalService.close();
									break;
								}
							}
						}
					})
			})
	}

});
