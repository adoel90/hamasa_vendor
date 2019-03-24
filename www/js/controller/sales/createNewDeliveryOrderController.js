distributionApp.controller('createNewDeliveryOrderController', function($scope, $rootScope, $salesService, $doService, $warehouseService, $modalService, $window, $timeout, $moment) {

	'use strict';

	var selectedSOId = routeParams.id;
	$rootScope.soId = encodeURIComponent(routeParams.id);
	$scope.requiredData = {
		date: $moment(new Date()).format('YYYY-MM-DD'),
		so_id: selectedSOId,
		warehouse_id: '',
		item: []
	}

	$scope.salesOrderDetail = null;

	$scope.headings = [
		{ name: 'Kategori' },
		{ name: 'Nama Barang', size: 'lg' },
		{ name: 'Satuan' },
		{ name: 'Grade' },
		{ name: 'Jumlah Pesanan' },
		{ name: 'Sisa Ambil' },
		{ name: 'Jumlah Ambil' },
		{ name: 'Keterangan', size: 'lg' },
	];

	$scope.init = function() {
		getSalesOrderDetail();
		getWarehouseList();
	}

	$scope.changeWarehouse = function(item) {
		$scope.requiredData.warehouse_id = item.id;
		$scope.selectedWarehouse = item;

		$salesService.get.salesOrderItemDetail(selectedSOId, $scope.requiredData.warehouse_id).then(response => {
			for(var i=0; i<$scope.salesOrderDetail.item.length; i++){
				$scope.salesOrderDetail.item[i].qtyOrdered = $scope.salesOrderDetail.item[i].quantity;
			}
			$scope.$apply();
		})
		.catch(error => {
			console.log(error);
		})
	}

	$scope.triggerModal = function(customMessage, customTitle, modalType){
     var modalOptions = {
        scope: $scope
     }

     $modalService.alert(modalOptions)
        .then(function() {
           $scope.alert = {
              type: modalType,
              title: customTitle,
              message: customMessage,
              button: [
                 { type: modalType, text: 'Kembali' }
              ]
           }

           $scope.doAction = function(index) {
              switch(index) {
                 case 0: {
                    $modalService.close();
                    if(modalType == "success") location.href = '/sales/salesorder/salesorderinfo/' + encodeURIComponent(selectedSOId);
                    break;
                 }
              }
           }

        })
        .catch(function(error) {
           console.warn(error);
        })
  }

	$scope.saveChanges = function() {

		for(var i=0; i < $scope.salesOrderDetail.item.length; i++){
			$scope.requiredData.item.push($scope.salesOrderDetail.item[i]);
		}

		setTimeout(()=>{
			console.log($scope.requiredData);
			$doService.post.createDo($scope.requiredData)
			.then(function(response) {
					$scope.triggerModal("Delivery Order telah berhasil dibuat.", "Success", "success");
			})
			.catch(function(error) {
				$scope.triggerModal(error.responseJSON.message, "Error", "danger");
			})
		}, 400);


	}

	$timeout($scope.init, 50);

	function getSalesOrderDetail() {
		$salesService.get.salesOrderDetail(selectedSOId)
			.then(function(response) {
				console.log(response);
				$scope.salesOrderDetail = response.result;

				$warehouseService.get.warehouse()
				.then(function(response) {
					$scope.warehouseList = response.result;
					for(var j=0; j<$scope.warehouseList.length; j++){
						if($scope.warehouseList[j].id == $scope.salesOrderDetail.item[0].warehouse.id){
							$scope.requiredData.warehouse_id = $scope.warehouseList[j].id;
							$scope.selectedWarehouse = $scope.warehouseList[j];
							break;
						}
					}

					$salesService.get.salesOrderItemDetail(selectedSOId, $scope.requiredData.warehouse_id).then(response => {
						$scope.salesOrderDetail.item = response.result.item;
						for(var i=0; i < $scope.salesOrderDetail.item.length; i++){
							$scope.salesOrderDetail.item[i].qtyOrdered = $scope.salesOrderDetail.item[i].quantity;
							$scope.salesOrderDetail.item[i].quantity = $scope.salesOrderDetail.item[i].outstanding;
						}
						$scope.$apply();
					})
					.catch(error => {
						console.log(error);
					})

				})
				.catch(function(error) {
					console.warn(error);
				})
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	function getSalesOrderItemDetail() {
		$salesService.get.salesOrderItemDetail($scope.requiredData.so_id, $scope.requiredData.warehouse_id)
			.then(function(response) {
				console.log(response);
				// $scope.salesOrderItemDetail = response.result;
				// $scope.$apply();
				// console.log(response.result);
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	function getWarehouseList() {

	}

});
