distributionApp.controller('createNewMutationController', function($scope, $rootScope,
	$warehouseService, $mutationService, $modalService, $timeout, $window) {

	'use strict';

	$scope.requiredData = {
		from: '',
		from_data: '',
		from_name: '',
		to: '',
		to_data: '',
		to_name: '',
		items: []
	};

	$scope.selectedItems = {
		headings: [
			{ name: 'No. Seri' },
			{ name: 'Kategori' },
			{ name: 'Nama Barang' },
			{ name: 'Satuan' },
			{ name: 'Grade' },
			{ name: 'Stok Plan' },
			{ name: 'Jumlah' },
			{ name: 'Action' }
		],
		items: []
	}



	$scope.changeWarehouse = function(item, type) {
		switch(type) {
			case 'from': {
				$scope.requiredData.from = item.id;
				$scope.requiredData.from_name = item.name;
				$scope.requiredData.from_data = item;
				$scope.selectedItems.items = [];

				break;
			}
			case 'to': {
				$scope.requiredData.to = item.id;
				$scope.requiredData.to_name = item.name;
				$scope.requiredData.to_data = item;

				break;
			}
		}
	}

	$scope.openItemList = function() {
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/addWarehouseItem.html',
			size: 'lg'
		}

		$modalService.open(modalOptions)
			.then(function(response) {
				$scope.warehouseItem = {
					requiredData: {
						warehouse_id: $scope.requiredData.from_data.id,
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
						{ name: 'Stok Plan' }
					]
				}

				$scope.searchFilters = [
					{ by: 'code', name: 'Kode Barang', placeholder: "Masukkan kode barang"},
					{ by: 'name', name: 'Nama Barang', placeholder: 'Masukkan nama barang' },
					{ by: 'category', name: 'Kategori', placeholder: 'Masukkan kategori' },
				];

				$scope.selectedFilter = {
					item: $scope.searchFilters[0]
				};

				$scope.chooseItem = function(item) {
					var qty = {
						quantity: ''
					}

					item = angular.extend({}, qty, item);
					$modalService.close();
					$scope.selectedItems.items.push(item);
				}

				$scope.doSearchFilter = function(val, type) {
					switch(type) {
						case 'code': {
							$scope.warehouseItem.requiredData.item_id = val;
							$scope.warehouseItem.requiredData.name = '';
							$scope.warehouseItem.requiredData.category = '';
							break;
						}
						case 'name': {
							$scope.warehouseItem.requiredData.name = val;
							$scope.warehouseItem.requiredData.item_id = '';
							$scope.warehouseItem.requiredData.category = '';

							break;
						}
						case 'category': {
							$scope.warehouseItem.requiredData.category = val;
							$scope.warehouseItem.requiredData.name = '';
							$scope.warehouseItem.requiredData.item_id = '';
							break;
						}
					}

					$rootScope.$broadcast('requestPaginationUpdate');

					getItemList();
				}

				$scope.modalInit = function() {
					getItemList();
				}

				$timeout(function() {
					$scope.modalInit();
				}, 50)


				$rootScope.$on('requestFetchData', function(event, args) {
					getItemList();
				});


				function getItemList() {
					$warehouseService.get.warehouseItem($scope.warehouseItem.requiredData)
						.then(function(response) {
							$scope.warehouseItem.items = response.result.data;
							console.log($scope.warehouseItem.items);
							$scope.totalRows = response.result.row;
							// $rootScope.$broadcast('requestPaginationUpdate');
							$scope.$apply();
						})
						.catch(function(error) {
							console.warn(error);
						})
				}

			})
			.catch(function(error) {

			});
	}

	$scope.deleteItem = function(items, index) {
		items.splice(index, 1);
	}

	$scope.saveMutation = function() {
		$scope.requiredData.items = $scope.selectedItems.items;

		$mutationService.post.addMutation($scope.requiredData)
			.then(function(response) {
				var modalOptions = {
					scope: $scope
				}

				$modalService.alert(modalOptions)
					.then(function(response) {
						$scope.alert = {
							type: 'success',
							title: 'Sukses!',
							message: 'Mutasi telah berhasil ditambahkan.',
							button: [
								{ type: 'success', text: 'Kembali' }
							]
						}

						$scope.doAction = function(index) {
							switch(index) {
								case 0: {
									$window.location.replace('/inventory/mutation');
									break;
								}
							}
						}
					})
					.catch(function(response) {

					})
			})
			.catch(function(error) {
				var modalOptions = {
					scope: $scope
				}

				$modalService.alert(modalOptions)
					.then(function(response) {
						$scope.alert = {
							type: 'danger',
							title: 'Error',
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
					.catch(function(response) {

					});
			});
	}

	$scope.init = function() {
		getWarehouseList();
	}

	$timeout(function() {
		$scope.init();
	}, 50);

	function getWarehouseList() {
		$warehouseService.get.warehouse()
			.then(function(response) {
				$scope.warehouses = response.result;
				$scope.requiredData.from = $scope.warehouses[0].id;
				$scope.requiredData.from_name = $scope.warehouses[0].name;
				$scope.requiredData.from_data = $scope.warehouses[0];

				$scope.requiredData.to = $scope.warehouses[0].id;
				$scope.requiredData.to_name = $scope.warehouses[0].name;
				$scope.requiredData.to_data = $scope.warehouses[0];
				$scope.$apply();
			})
			.catch(function(error) {
			})
	}


});
