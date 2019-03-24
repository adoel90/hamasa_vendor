distributionApp.controller('createNewBtbController', function($scope, $rootScope,
	$itemService, $purchaseService, $btbService, $mutationService, $modalService, $timeout, $myCookies, $doService, $moment) {

	'use strict';

	var accessToken = $myCookies.get("accessToken");

	$scope.deliveryTypes = [
		{ type: 'po', name: 'PO' 	},
		{ type: 'mutation', name: 'MUTATION' },
		{ type: 'retur', name: 'RETUR' },
		{ type: 'bpb', name: 'BPB' },
	];

	$scope.requiredData = {
		date: $moment(new Date()).format('YYYY-MM-DD'),
		type: $scope.deliveryTypes[0].name,
		type_data: $scope.deliveryTypes[0],
		order_id: '',
		transport_number: '',
		driver: '',
		from: '',
		description: '',
		item: [],
		so_id: ''
	};

	$scope.headings = [
		{ name: 'Kategori', hide: false },
		{ name: 'Nama Barang', hide: false },
		{ name: 'Satuan', hide: false },
		{ name: 'Grade', hide: false },
		{ name: 'Jumlah Order', hide: false },
		{ name: 'Jumlah Terima', hide: false },
		{ name: 'Keterangan', size: 'lg', hide: false },
		{ name: 'Action', hide: false}
	]

	$scope.documentPlaceholder = "Masukkan nomor PO";
	$scope.changeDeliveryType = function(type) {

		$scope.requiredData = {
			type: type.name,
			type_data: type,
			order_id: '',
			transport_number: '',
			driver: '',
			from: '',
			description: '',
			item: []
		};
		$scope.documentDetail = null;
		if(type.name == 'PO'){
			$scope.documentPlaceholder = "Masukkan nomor PO";
		}
		else if(type.name == 'MUTATION'){
			$scope.documentPlaceholder = "Masukkan nomor Mutasi";
		}
		else if(type.name == 'RETUR'){
			$scope.documentPlaceholder = "Masukkan nomor DO";
			$scope.headings[5].name = "Jumlah Retur";

		} else if(type.name == 'BPB'){
			$scope.documentPlaceholder = "Masukkan nomor BPB";

		}
	};

	$scope.deleteItem = function(index){
		$scope.requiredData.item.splice(index, 1);
	}
	$scope.searchItemByType = function(type) {
		$scope.requiredData.item = [];
		$scope.requiredData.order_id = $scope.requiredData.order_id.toUpperCase();
		switch(type) {
			case 'po': {
				$purchaseService.order.get.purchaseOrderDetail($scope.requiredData.order_id)
					.then(function(response) {
						console.log(response);
						$scope.documentDetail = response.result;
						$scope.requiredData.from = $scope.documentDetail.supplier.name;
						$scope.requiredData.item = $scope.documentDetail.item;
						
						angular.forEach($scope.requiredData.item, function(item) {
							item.order_quantity = item.quantity;
							item.quantity = 0;
							item.description = '';
						});

						$scope.$apply();
					})
					.catch(function(error) {
						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
					})

				break;
			}
			case 'mutation': {
				$mutationService.get.mutationDetail($scope.requiredData.order_id)
					.then(function(response) {
						console.log(response);
						$scope.requiredData.driver = response.result.bkb.do.bkb.driver;
						$scope.requiredData.transport_number = response.result.bkb.do.bkb.transport_number;
						
						if(angular.equals(response.result.from, {})){
							$rootScope.triggerModal("BKB harus dibuat terlebih dahulu untuk mutasi ini", "Error", "danger", "");
						}
						else{
							$scope.documentDetail = response.result;
							$scope.requiredData.from = $scope.documentDetail.from.warehouse.name;
							$scope.requiredData.item = $scope.documentDetail.item;

							console.log($scope.requiredData.item);

							angular.forEach($scope.requiredData.item, function(item) {
								item.order_quantity = item.quantity;
								item.quantity = 0;
								item.description = '';
							});
							$scope.$apply();
						}
					})
					.catch(function(error) {
						console.log(error);
						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
					});

				break;
			}
			case 'retur': {
				
				$doService.get.doDetail($scope.requiredData.order_id).then(response => {
					console.log(response);
					$scope.documentDetail = response.result;
					$scope.requiredData.from = $scope.documentDetail.customer.name;
					$scope.requiredData.item = $scope.documentDetail.item;

					for(var i=0; i < $scope.requiredData.item.length; i++){
						$scope.requiredData.item[i].order_quantity = $scope.requiredData.item[i].quantity;
						$scope.requiredData.item[i].quantity = 0;
						$scope.requiredData.item[i].description = "";
					}
					$scope.requiredData.so_id = response.result.so_id;
					$scope.$apply();
				})
				.catch(error => {
					console.log(error);
					$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
				})
				break;
			}

			case 'bpb': {
				$purchaseService.order.get.purchaseBPBDetail($scope.requiredData.order_id)
					.then(function(response) {
						console.log(response);
						// $scope.documentDetail = response.result;
						// $scope.requiredData.from = $scope.documentDetail.supplier.name;
						// $scope.requiredData.item = $scope.documentDetail.item;
						
						// angular.forEach($scope.requiredData.item, function(item) {
						// 	item.order_quantity = item.quantity;
						// 	item.quantity = 0;
						// 	item.description = '';
						// });

						// $scope.$apply();
					})
					.catch(function(error) {
						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
					})

				break;
			}
		}
	}

	$scope.$on("chooseItemInMasterList", function(event, args){
		var item = args.state.item;

		var extraParams = {
			quantity: '',
			order_quantity: 0,
			description: ''
		}
		item = angular.extend({}, extraParams, item);
		console.log(item);
		$scope.requiredData.item.push(item);
		$modalService.close();
	})


	$scope.saveBtb = function() {
		console.log($scope.requiredData);
		$btbService.post.createBtb($scope.requiredData)
		.then(function(response) {
			console.log(response);
			var printBtbUrl = api.url + "btb/print?accessToken=" + accessToken + "&id=" + response.result;
			//pas sukses tolong return btbId di response

			$rootScope.triggerModal("Bukti Terima Barang telah berhasil dibuat.", "Success", "success", printBtbUrl);
		})
		.catch(function(error) {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

})
