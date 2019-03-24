distributionApp.controller('createNewConversionController', function($scope, $rootScope, $conversionService,
	$warehouseService, $modalService, $timeout, $window) {

	'use strict';

	$scope.requiredData = {
		warehouse: '',
		w_id: '',
		ig_id: '',
		quantity: '',
		convert_item: []
	}

	$scope.headings = [
		{ name: 'Kategori' },
		{ name: 'Nama Barang' },
		{ name: 'Satuan' },
		{ name: 'Grade' },
		{ name: 'Jumlah' },
		{ name: 'Action' }
	]

	$scope.changeWarehouse = function(warehouse) {
		$scope.requiredData.w_id = warehouse.id;
	}

	$scope.addItem = function(args) {
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/addWarehouseItem.html',
			size: 'lg'
		}

		$modalService.open(modalOptions)
			.then(function(response) {
				$scope.warehouseItem = {
					requiredData: {
						warehouse_id: $scope.requiredData.w_id,
						limit: 10,
						offset: 0,
						category: '',
						name: '',
						item_id: ''
					},
					headings: [
						{ name: 'No. Seri' },
						{ name: 'Kategori' },
						{ name: 'Nama Barang' },
						{ name: 'Satuan' },
						{ name: 'Grade' },
						{ name: 'Stok Aktual' }
					]
				}

				$scope.searchFilters = [
					{ by: 'name', name: 'Nama'},
					{ by: 'category', name: 'Kategori' }
				]

				$scope.selectedFilter = {
					item: $scope.searchFilters[0]
				}

				$scope.doSearchFilter = function(val, type) {
					switch(type) {
						case 'name': {
							$scope.warehouseItem.requiredData.name = val;
							$scope.warehouseItem.requiredData.category = '';

							break;
						}
						case 'category': {
							$scope.warehouseItem.requiredData.category = val;
							$scope.warehouseItem.requiredData.name = '';

							break;
						}
					}

					$scope.init();
				}

				$scope.chooseItem = function(item) {
					if(args == 'conversion') {
						var extraObject = {
							quantity: ''
						}

						item = angular.extend({}, extraObject, item)
						$scope.requiredData.convert_item.push(item);
						console.log($scope.requiredData.convert_item);
					} else {
						$scope.selectedItem = item;
						$scope.requiredData.ig_id = item.ig_id;

					}

					$modalService.close();
				}

				$scope.removeItem = function(index) {
					$scope.requiredData.convert_item.splice(index, 1);
					console.log($scope.requiredData);
				}

				$rootScope.$on('requestFetchData', function() {
					$scope.init();
				});

				$scope.init = function() {
					getWarehouseItem($scope.warehouseItem.requiredData);
				}

				$timeout(function() {
					$scope.init();
				}, 50);
			})
			.catch(function(error) {
				console.warn(error);
			});
	}


	$scope.saveConversion = function() {
		console.log($scope.requiredData);
		// if($scope.requiredData.quantity > $scope.selectedItem.actual){
		// 	var modalOptions = {
		// 		scope: $scope
		// 	}
		//
		// 	$modalService.alert(modalOptions)
		// 		.then(function(response){
		// 			$scope.alert = {
		// 				type: 'danger',
		// 				title: 'Error',
		// 				message: 'Jumlah barang yg dikonversi tidak boleh lebih besar dari stok aktual',
		// 				button: [
		// 					{ type: 'danger', text: 'Kembali' }
		// 				]
		// 			}
		//
		// 			$scope.doAction = function(index) {
		// 				switch(index) {
		// 					case 0: {
		// 						$modalService.close();
		// 					}
		// 				}
		// 			}
		// 		})
		// 		.catch(function(error) {
		//
		// 		});
		// }
		// else{
			$conversionService.post.createConversion($scope.requiredData)
				.then(function(response) {
					var modalOptions = {
						scope: $scope
					}

					$modalService.alert(modalOptions)
						.then(function(response){
							$scope.alert = {
								type: 'success',
								title: 'Sukses!',
								message: 'Konversi telah berhasil ditambahkan.',
								button: [
									{ type: 'success', text: 'Kembali' }
								]
							}

							$scope.doAction = function(index) {
								switch(index) {
									case 0: {
										$window.history.back();
									}
								}
							}
						})
						.catch(function(error) {

						});
				})
				.catch(function(error) {
					console.warn(error);
					$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
				});
		// }

	}

	$scope.init = function() {
		getWarehouseList();
	}

	$timeout(function() {
		$scope.init();
	})

	function getWarehouseList() {
		$warehouseService.get.warehouse()
			.then(function(response) {
				$scope.warehouseList = response.result;
				$scope.requiredData.warehouse = $scope.warehouseList[0];
				$scope.requiredData.w_id = $scope.warehouseList[0].id;
				$scope.$apply();
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	function getWarehouseItem(data) {
		$warehouseService.get.warehouseItem(data)
			.then(function(response) {
				$scope.warehouseItem.items = response.result.data;
				$scope.totalRows = response.result.row;
				$scope.$apply();
			})
			.catch(function(error) {

			})

	}




});
