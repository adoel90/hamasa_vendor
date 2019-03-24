distributionApp.controller('stockAdjustmentController', function($scope, $rootScope,
    $inventoryService, $warehouseService, $modalService, $window, $timeout, $myCookies) {

    'use strict';

    var accessToken = $myCookies.get("accessToken");
    
	$scope.requiredData = {
		limit: 10,
		offset: 0,
		warehouse: '',
        item_name: '',
        category: '',
        item_id: ''
	};

	$scope.headings = [
		{ name: 'Kategori' },
		{ name: 'Nama Barang' },
		{ name: 'Satuan' },
		{ name: 'Grade' },
		{ name: 'Stok Planning' },
		{ name: 'Stok Aktual' },
		{ name: 'Action' }
	];

    $scope.searchFilters = [
        { by: 'code', name: 'Kode Barang', placeholder: 'Masukkan kode barang' },
        { by: 'name', name: 'Nama Barang', placeholder: 'Masukkan nama barang' },
        { by: 'category', name: 'Kategori', placeholder: 'Masukkan kategori' }
    ]

    $scope.selectedFilter = {
        item: $scope.searchFilters[0]
    }

    $scope.init = function() {
        getWarehouseList();
    }

    $scope.changeWarehouse = function(item) {
        $scope.requiredData.warehouse_data = item;
        $scope.requiredData.warehouse = item.id;

        setTimeout(()=>{
          $scope.getWarehouseDetail();
        },200);

    }

    $timeout(function() {
        $scope.init();
    }, 50);

    $scope.doSearchFilter = function(val, type) {
      $scope.requiredData.offset = 0;
        switch(type) {
            case 'code': {
                $scope.requiredData.item_id = val;
                $scope.requiredData.item_name = '';
                $scope.requiredData.category = '';
                break;
            }
            case 'name': {
                $scope.requiredData.item_id = '';
                $scope.requiredData.item_name = val;
                $scope.requiredData.category = '';
                break;
            }
            case 'category': {
                $scope.requiredData.item_id = '';
                $scope.requiredData.item_name = '';
                $scope.requiredData.category = val;
                break;
            }
        }

        $rootScope.$broadcast('requestPaginationUpdate');

        $scope.getWarehouseDetail();
    }

    $scope.exportToExcel = function(){
        location.href = api.url + 'report/inventory/stock/adjustment?accessToken=' + accessToken + '&warehouse=' + $scope.requiredData.warehouse + '&item_name=' + $scope.requiredData.item_name + '&category=' + $scope.requiredData.category + '&item_id=' + $scope.requiredData.item_id + '&export=' + true;
    }

	$scope.getWarehouseDetail = function() {
		$inventoryService.get.warehouseInventoryList($scope.requiredData)
			.then(function(response) {
        console.log(response);
				$scope.warehouseDetail = response.result;
				$scope.totalRows = response.result.row;
				$scope.$apply();

				console.log(response);
			})
			.catch(function(error) {
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			});
	}

	$scope.adjustStock = function(item) {
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/adjustStock.html'
		}

		$modalService.open(modalOptions)
			.then(function(response) {

        setTimeout(()=>{
          $scope.initAdjustStokModal();
        }, 150);

        $scope.initAdjustStokModal = function(){
          $scope.listFields = [
            {name: "ID Barang", value: item.ig_id},
            {name: "Kategori", value: item.category.name},
            {name: "Nama Barang", value: item.name},
            {name: "Satuan", value: item.unit},
            {name: "Grade", value: item.grade},
            {name: "Stok Plan", value: item.stock.plan},
            {name: "Stok Aktual", value: item.stock.actual}
          ]

          $scope.selectedItem = {
            ig_id: item.ig_id,
            stock_actual: 0,
            reason: ""
          }

          $scope.$apply();
        }

				$scope.saveStock = function() {
					var	requiredData = {
						w_id: $scope.warehouseDetail.id,
						ig_id: $scope.selectedItem.ig_id,
						stock_actual: $rootScope.numberWithNoCommas($scope.selectedItem.stock_actual),
						reason: $scope.selectedItem.reason
					}

					$inventoryService.put.adjustInventory(requiredData)
						.then(function(response) {
              $rootScope.triggerModal("Stok barang telah berhasil diubah.", "Success", "success", "/inventory/stockadjustment");
						})
						.catch(function(error) {
							$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
						})
				}
			})
	}

	$rootScope.$on('requestFetchData', function() {
		$scope.getWarehouseDetail();
	});

    function getWarehouseList() {
        $warehouseService.get.warehouse()
            .then(function(response) {
                $scope.warehouseList = response.result;
                $scope.requiredData.warehouse_data = $scope.warehouseList[0];
                $scope.requiredData.warehouse = $scope.warehouseList[0].id;
                console.log($scope.requiredData);
                $scope.$apply(function() {

                    $timeout(function() {
                        $scope.getWarehouseDetail();
                    })
                });
            })
            .catch(function(error) {
                console.warn(error);
            })
    }
});
