distributionApp.controller('btbController', function($scope, $rootScope, $btbService, $modalService, $timeout, $myCookies) {

	'use strict';

	var accessToken = $myCookies.get("accessToken");
	$scope.requiredData = {
		limit: 10,
		offset: 0,
		id: '',
		from: '',
		date: '',
		s_date: '',
		e_date: ''
	}

	$scope.headings = [
		{ name: 'No. BTB' },
		{ name: 'Tanggal Pengiriman' },
		{ name: 'Jenis BTB' },
		{ name: 'Asal Pengirim' },
		{ name: 'Keterangan', size: 'lg' }
	]

	$scope.searchFilters = [
		{ by: 'id', name: 'Nomor BTB', placeholder: 'Masukkan Nomor BTB' },
		{ by: 'from', name: 'Asal Pengirim', placeholder: 'Masukkan Pengirim' },
		{ by: 'date', name: 'Tanggal BTB', placeholder: 'Masukkan Tanggal Pengiriman' },
		{ by: 'range_date', name: 'Range Tanggal'}
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}

	$scope.cols = ['id', 'date', 'type', 'from', 'desc'];
	$scope.btnName = "Buat BTB";
	$scope.tableType = 'non-edited-table';

	$scope.redirectToCreateNewData = function(){
		location.href = '/inventory/btb/createnewbtb';
	}

	$scope.doSearchFilter = function(val, type) {
		$scope.requiredData.offset = 0;
		switch(type) {
			case 'id': {
				$scope.requiredData.id = val;
				$scope.requiredData.from = '';
				$scope.requiredData.date = '';
				$scope.requiredData.s_date = '';
				$scope.requiredData.e_date = '';
				break;
			}
			case 'from': {
				$scope.requiredData.id = '';
				$scope.requiredData.from = val;
				$scope.requiredData.date = '';
				$scope.requiredData.s_date = '';
				$scope.requiredData.e_date = '';
				break;
			}
			case 'date': {
				$scope.requiredData.id = '';
				$scope.requiredData.from = '';
				$scope.requiredData.date = val;
				$scope.requiredData.s_date = '';
				$scope.requiredData.e_date = '';
				break;
			}
		}

		$scope.init();
	}

	$scope.$on("openDetailDataInTable", function(event, args){
		var btbId = args.state.data.id;
		var modalOptions = {
			scope: $scope,
			size: 'lg',
			templateUrl: '/dist/view/modal/btbDetail.html'
		}

		$modalService.open(modalOptions).then(function(response) {
			$scope.btbDetail = {
				headings: [
					{ name: 'Serial'},
					{ name: 'Kategori' },
					{ name: 'Nama Barang' },
					{ name: 'Satuan' },
					{ name: 'Berat' },
					{ name: 'Grade' },
					{ name: 'Jumlah' },
					{ name: 'Keterangan' }
				],
				column: [
					{name: 'serial', type: 'text'},
					{name: 'categoryName', type: 'text'},
					{name: 'name', type: 'text'},
					{name: 'unit', type: 'text'},
					{name: 'weight', type: 'number'},
					{name: 'grade', type: 'text'},
					{name: 'quantity', type: 'number'},
					{name: 'note', type: 'text'}
				],
				data: ''
			}

			$scope.modalInit = function() {
				$btbService.get.btbDetail(btbId).then(function(response) {
					$scope.btbDetail.data = response.result;
					for(var i=0; i < $scope.btbDetail.data.item.length; i++){
						$scope.btbDetail.data.item[i].categoryName = $scope.btbDetail.data.item[i].category.name;
					}
					$scope.$apply();
				})
				.catch(function(error) {
					$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
				});
			}

			$scope.printBtb = function(btbId){
				location.href = api.url + "btb/print?accessToken=" + accessToken + "&id=" + btbId;
			}

			$timeout(function() {
				$scope.modalInit();
			}, 50);
		});
	})

	$scope.init = function() {
		getBtbList();
	}

	$timeout(function() { $scope.init(); }, 150);

	$scope.exportToExcel = function(){
		location.href = api.url + "report/inventory/btb/list?accessToken=" + accessToken + "&export=" + true + '&id=' + $scope.requiredData.id + '&from=' + $scope.requiredData.from + '&date=' + $scope.requiredData.date + "&s_date=" + $scope.requiredData.s_date + "&e_date=" + $scope.requiredData.e_date;
	}

	$rootScope.$on('requestFetchData', function() {
		$scope.init();
	});

	function getBtbList() {
		$btbService.get.btbList($scope.requiredData).then(function(response) {
			console.log(response);
			$scope.listData = response.result.data;
			$scope.totalRows = response.result.row;
			$scope.$apply();
		})
		.catch(function(error) {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		});
	}

});
