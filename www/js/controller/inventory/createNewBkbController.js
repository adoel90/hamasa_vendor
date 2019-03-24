distributionApp.controller('createNewBkbController', function($scope, $rootScope, $bkbService,
	$doService, $modalService, $timeout, $window, $myCookies, $moment) {

	'use strict';

	$scope.requiredData = {
		date: $moment(new Date()).format('YYYY-MM-DD'),
		do_id: '',
		transport_number: '',
		driver: '',
		note: '',
		item: []
	}

	//- contoh nomor DO: HM/201708/1
	var accessToken = $myCookies.get("accessToken");

	$scope.headings = [
		{ name: 'Kategori' },
		{ name: 'Nama Barang' },
		{ name: 'Satuan' },
		{ name: 'Grade' },
		{ name: 'Jumlah Ambil' },
		{ name: 'Jumlah Keluar' },
		{ name: 'Keterangan' }
	];

	$scope.searchDO = function() {
		$scope.requiredData.do_id = $scope.requiredData.do_id.toUpperCase();
		$doService.get.doDetail($scope.requiredData.do_id)
			.then(function(response) {
				$scope.doDetail = response.result;
				for(var i=0; i < $scope.doDetail.item.length; i++){
					$scope.doDetail.item[i].quantity_out = $scope.doDetail.item[i].quantity;
				}
				$scope.requiredData.item = $scope.doDetail.item;
				$scope.$apply();
			})
			.catch(function(error) {
				console.log(error);
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			});
	}

	$scope.saveBkb = function() {
		console.log($scope.requiredData);
		$scope.tempData = angular.copy($scope.requiredData);

		angular.forEach($scope.tempData.item, function(item) {
			item.quantity = item.quantity_out;
		});

		$bkbService.post.createBkb($scope.tempData)
		.then(function(response) {
			var printBkbUrl = api.url + "bkb/print?accessToken=" + accessToken + "&id=" + response.result;
			$rootScope.triggerModal("Bukti Keluar Barang telah berhasil dibuat.", "Success", "success", printBkbUrl);

		})
		.catch(function(error) {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

});
