distributionApp.controller('tipoInfoController', function($scope, $rootScope, $salesService, $tipoService, $modalService, $timeout, $window, $spkService, $myCookies, $invoiceService) {

	'use strict';

	var selectedId = routeParams.id;
	var accessToken = $myCookies.get("accessToken");

	$rootScope.tipoId = encodeURIComponent(routeParams.id);
	console.log($rootScope.tipoId);

	$scope.page = 'Tipo Info';

	$scope.init = function() {
		getTipoInfo();
	}

	// 0 = abu2: open
	// -1 = merah: canceled
	// 1 = kuning: aktif
	// 2 = ijo: done
	$scope.getDOStatus = function(status) {
		switch(status) {
			case 0: {
				return 'tile--muted'
				break;
			}
			case -1: {
				return 'tile--danger'
				break;
			}
			case 1: {
				return 'tile--active'
				break;
			}
			case 2: {
				return 'tile--completed'
				break;
			}
		}
	}

	$timeout($scope.init, 50);

	$scope.openSpkDetail = function(spkId){
		console.log(spkId);
		var modalOptions = {
			 scope: $scope,
			 templateUrl: '/dist/view/modal/spkDetail.html',
			 size: 'lg'
		}

		$modalService.open(modalOptions)
		.then(function(response) {
			 $scope.detailHeadings = [
					{name: "Kategori"},
					{name: "Nama Barang"},
					{name: "Jumlah"},
					{name: "Keterangan"}
			 ];

			 $scope.printSpk = function(spkId){
				 location.href = api.url + "spk/print?accessToken=" + accessToken + "&id=" + spkId;
			 }

			 $scope.columns = ["category", "name", "quantity", "note"];
			 $spkService.get.detailSpk(spkId).then(function(response){
					console.log(response);
					$scope.spkDetail = response.result;
					$scope.$apply();
			 })
			 .catch(function(error){
					console.log(error);
			 })
		})
		.catch(function(error){
			 console.log(error);
		})
	}

	function getTipoInfo() {
		$tipoService.get.tipoInfo(selectedId)
			.then(function(response) {
				console.log(response);
				$scope.tipoInfo = response.result;
				$scope.$apply();
				console.log($scope.tipoInfo);
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

});
