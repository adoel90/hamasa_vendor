distributionApp.controller('warehouseInventoryController', function($scope, $rootScope,
    $inventoryService, $modalService, $warehouseService, $timeout, $myCookies) {

    'use strict';

    var accessToken = $myCookies.get('accessToken');
    $scope.requiredData = {
        limit: 10,
        offset: 0,
        warehouse: '',
        item_name: '',
        category: '',
        item_id: ''
    }

    $scope.headings = [
        { name: 'Kategori' },
        { name: 'Nama Barang' },
        { name: 'Grade' },
        { name: 'Stok Planning' },
        { name: 'Stok Aktual' },
        { name: 'ROP' },
        { name: 'Stok Maksimum' },
        { name: 'Action' }
    ];

    $scope.warehouseInventory = {};

    $scope.searchFilters = [
        { by: 'code', name: 'Kode Barang', placeholder: "Masukkan kode barang"},
    	{ by: 'name', name: 'Nama Barang', placeholder: "Masukkan nama barang" },
    	{ by: 'category', name: 'Kategori', placeholder: "Masukkan kategori" }
    ]

    $scope.selectedFilter = {
    	item: $scope.searchFilters[0]
    }

    $scope.getWarehouseDetail = function() {
        $inventoryService.get.warehouseInventoryList($scope.requiredData)
            .then(function(response) {
                $scope.warehouseInventory.detail = response.result;
                $scope.totalRows = response.result.row;
                // console.log($scope.warehouseInventory.detail);
                $scope.$apply();
            })
            .catch(function(error) {
                var modalOptions = {
                    scope: $scope
                }

                $modalOptions.alert(modalOptions)
                    .then(function(response) {
                        $scope.alert = {
                            type: 'danger',
                            title: 'Error',
                            message: 'Pencarian gudang tidak berhasil karena ID yang dimasukkan tidak ditemukan.',
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
                    .catch(function(error) {

                    })
            })
    }

    $scope.doSearchFilter = function(val, type) {
        console.log(val);
        console.log(type);
    	console.log($scope.requiredData);
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

    	$scope.getWarehouseDetail();
    }

    $rootScope.$on('requestFetchData', function() {
        $scope.getWarehouseDetail();
    });

    $scope.exportToExcel = function(){
        location.href = api.url + 'report/inventory/warehouse?accessToken=' + accessToken + '&warehouse=' + $scope.requiredData.warehouse + '&item_name=' + $scope.requiredData.item_name + '&category=' + $scope.requiredData.category + '&item_id=' + $scope.requiredData.item_id + '&export=' + true;
    }

    $scope.editItem = function(item) {
      var modalOptions = {
        scope: $scope,
        templateUrl: '/dist/view/modal/editWarehouseInventory.html',
      }
      $modalService.open(modalOptions).then(function(response){

        $scope.itemToEdit = {
          ig_id: item.ig_id,
          serial: item.serial,
          category: item.category.name,
          name: item.name,
          minimum: item.stock.minimum,
          maximum: item.stock.maximum
        }

        $scope.saveItem = function(item){
          console.log(item);
          var requiredData = {
              w_id: $scope.warehouseInventory.detail.id,
              ig_id: item.ig_id,
              maximum: $rootScope.numberWithNoCommas(item.maximum),
              minimum: $rootScope.numberWithNoCommas(item.minimum)
          }

          $inventoryService.put.updateInventory(requiredData)
          .then(function(response) {
            $rootScope.triggerModal("Perubahan terhadap stok inventory gudang berhasil.", "Success", "success", "/inventory/warehouseinventory");
          })
          .catch(function(error) {
            $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
          })
        }

      });

    }

    $scope.init = function() {
        getWarehouseList();
    }


    $timeout($scope.init, 50);

    $scope.changeWarehouse = function(item) {
        $scope.requiredData.warehouse = item.id;
        $scope.requiredData.warehouse_data = item;

        $scope.getWarehouseDetail();
    }

    function getWarehouseList() {
        console.log(123);

        $warehouseService.get.warehouse()
            .then(function(response) {
                $scope.warehouseList = response.result;
                console.log(response);
                $scope.requiredData.warehouse = $scope.warehouseList[0].id;
                $scope.requiredData.warehouse_data = $scope.warehouseList[0];
                $scope.$apply(function() {
                    $scope.getWarehouseDetail();
                });
            })
            .catch(function(error) {
                console.warn(error);
            });
    }


});
