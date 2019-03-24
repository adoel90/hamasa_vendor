distributionApp.controller('conversionController', function($scope, $rootScope, $conversionService,
	$modalService, $timeout, $myCookies) {

	'use strict';

	var accessToken = $myCookies.get('accessToken');
	$scope.requiredData = {
		limit: 10,
		offset: 0,
		warehouse: '',
		item_id: '',
		item_name: '',
		s_date: '',
		e_date: ''
	}

	$scope.headings = [
		{ name: 'No. Konversi' },
		{ name: 'Tanggal Konversi'},
		{ name: 'Nama Gudang', size: 'lg' }
	]

	$scope.searchFilters = [
		{ by: 'name', name: 'Nama Gudang', placeholder: 'Masukkan Nama Gudang' },
		{ by: 'item_id', name: 'ID Barang', placeholder: 'Masukkan ID Barang'},
		{ by: 'item_name', name: 'Nama Barang', placeholder: 'Masukkan Nama Barang'},
		{ by: 'range_date', name: 'Range Tanggal', placeholder: ''}
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	};

	$scope.cols = ['id', 'date', 'warehouseName'];
  	$scope.btnName = "Buat Konversi";
	$scope.tableType = 'non-edited-table';

	$scope.redirectToCreateNewData = function(){
    location.href = '/inventory/conversion/createnewconversion';
  }

	$scope.doSearchFilter = function(val, type) {
		$scope.requiredData.offset = 0;
		switch(type) {
			case 'name': {
				$scope.requiredData.warehouse = val;
				$scope.requiredData.item_id = "";
				$scope.requiredData.item_name = "";
				$scope.requiredData.s_date = "";
				$scope.requiredData.e_date = "";
				break;
			}
			case 'item_id': {
				$scope.requiredData.warehouse = "";
				$scope.requiredData.item_id = val;
				$scope.requiredData.item_name = "";
				$scope.requiredData.s_date = "";
				$scope.requiredData.e_date = "";
				break;
			}
			case 'item_name': {
				$scope.requiredData.warehouse = "";
				$scope.requiredData.item_id = "";
				$scope.requiredData.item_name = val;
				$scope.requiredData.s_date = "";
				$scope.requiredData.e_date = "";
				break;
			}
		}
		$scope.init();
	}

	$scope.exportToExcel = function(){
		location.href = api.url + "report/inventory/conversion/list?accessToken=" + accessToken + "&export=" + true + "&warehouse=" + $scope.requiredData.warehouse + '&item_id=' + $scope.requiredData.item_id + '&item_name=' + $scope.requiredData.item_name + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date;
	}

	$scope.$on("openDetailDataInTable", function(event, args){
		var conversionId = args.state.data.id;
		var modalOptions = {
			scope: $scope,
			size: 'lg',
			templateUrl: '/dist/view/modal/conversionDetail.html'
		}

		$modalService.open(modalOptions).then(function(response) {
			$scope.conversionDetail = {
				items: [],
				headings: [
					{ name: 'Kategori' },
					{ name: 'Nama Barang' },
					{ name: 'Satuan' },
					{ name: 'Grade' },
					{ name: 'Jumlah' }
				]
			}

			$scope.modalInit = function() {
				getConversionDetail(conversionId);
			}

			$timeout(function() { $scope.modalInit(); }, 100);

			function getConversionDetail(id) {
				$conversionService.get.conversionDetail(id).then(function(response) {
					console.log(response);
					$scope.conversionDetail.item = response.result;
					$scope.$apply();
				})
				.catch(function(error) {
					$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
				})
			}
		})
	})

	$scope.openConversionDetail = function(id) {
		var modalOptions = {
			scope: $scope,
			size: 'lg',
			templateUrl: '/dist/view/modal/conversionDetail.html'
		}

		$modalService.open(modalOptions)
			.then(function(response) {
				$scope.conversionDetail = {
					items: [],
					headings: [
						{ name: 'Kategori' },
						{ name: 'Nama Barang' },
						{ name: 'Satuan' },
						{ name: 'Grade' },
						{ name: 'Jumlah' }
					]
				}

				$scope.init = function() {
					getConversionDetail();
				}

				$timeout(function() {
					$scope.init();
				}, 50);

				function getConversionDetail() {
					console.log(id);

					$conversionService.get.conversionDetail(id)
						.then(function(response) {
							$scope.conversionDetail.item = response.result;
							$scope.$apply();
						})
						.catch(function(error) {
							console.warn(error);
						})
				}
			})

	}

	$rootScope.$on('requestFetchData', function() {
		$scope.init();
	})

	$scope.init = function() { getConversionList(); }

	$timeout(function() { $scope.init(); }, 100);

	function getConversionList() {
		$conversionService.get.conversionList($scope.requiredData).then(function(response) {
			for(var i=0; i < response.result.data.length; i++){
				response.result.data[i].warehouseName = response.result.data[i].warehouse.name;
			}
			$scope.listData = response.result.data;
			$scope.totalRows = response.result.row;
			$scope.$apply();
		})
		.catch(function(error) {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

});
