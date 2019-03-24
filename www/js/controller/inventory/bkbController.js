distributionApp.controller('bkbController', function($scope, $rootScope, $bkbService, $modalService, $timeout, $myCookies){

	'use strict';
	var accessToken = $myCookies.get("accessToken");

	$scope.requiredData = {
		limit: 10,
		offset: 0,
		id: '',
		date: '',
		do_id: '',
		c_name: '',
		s_date: '',
		e_date: ''
	}

	$scope.headings = [
		{ name: 'No. BKB' },
		{ name: 'Tanggal Pengiriman' },
		{ name: 'No. DO' },
		{ name: 'Untuk Customer' }
	]

	$scope.searchFilters = [
		{ by: 'id', name: 'ID', placeholder: 'Masukkan Nomor BKB' },
		{ by: 'date', name: 'Tanggal', placeholder: 'Masukkan Tanggal Pengiriman' },
		{ by: 'do_id', name: 'No. D0', placeholder: 'Masukkan Nomor DO' },
		{ by: 'c_name', name: 'Nama Customer', placeholder: 'Masukkan Nama Customer' },
		{ by: 'range_date', name: 'Range Tanggal' }
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}

	$scope.cols = ['id', 'date', 'doId', 'customerName'];
	$scope.btnName = "Buat BKB";
	$scope.tableType = 'non-edited-table';

	$scope.redirectToCreateNewData = function(){
    location.href = '/inventory/bkb/createnewbkb';
  }

	$scope.doSearchFilter = function(val, type) {
		$scope.requiredData.offset = 0;
		switch(type) {
			case 'id': {
				$scope.requiredData.id = val;
				$scope.requiredData.date = '';
				$scope.requiredData.do_id = '';
				$scope.requiredData.c_name = '';
				break;
			}
			case 'date': {
				$scope.requiredData.id = '';
				$scope.requiredData.date = val;
				$scope.requiredData.do_id = '';
				$scope.requiredData.c_name = '';
				break;
			}
			case 'do_id': {
				$scope.requiredData.id = '';
				$scope.requiredData.date = '';
				$scope.requiredData.do_id = val;
				$scope.requiredData.c_name = '';
				break;
			}
			case 'c_name': {
				$scope.requiredData.id = '';
				$scope.requiredData.date = '';
				$scope.requiredData.do_id = '';
				$scope.requiredData.c_name = val;
				break;
			}
		}

		$scope.init();
	}

	$scope.$on("openDetailDataInTable", function(event, args){
		var bkbId = args.state.data.id;
		var modalOptions = {
			scope: $scope,
			size: 'lg',
			templateUrl: '/dist/view/modal/bkbDetail.html'
		}

		$modalService.open(modalOptions)
		.then(function(response) {
			$scope.bkbItem = {
				headings: [
					{ name: 'Serial'},
					{ name: 'Kategori' },
					{ name: 'Nama Barang' },
					{ name: 'Satuan' },
					{ name: 'Berat' },
					{ name: 'Jumlah Ambil' },
					{ name: 'Jumlah Keluar' },
					{ name: 'Keterangan' }
				],
				detail: {}
			}

			$scope.modalInit = function() {
				getBKBDetail(bkbId);
			}

			$timeout(function() { $scope.modalInit(); }, 100)

			$scope.printBkb = function(bkbId){
				location.href= api.url + "bkb/print?accessToken=" + accessToken + "&id=" + bkbId;
			}

			function getBKBDetail(id) {
				$bkbService.get.bkbDetail(id).then(function(response) {
					console.log(response);
					$scope.bkbItem.detail = response.result;
					$scope.$apply();
				})
				.catch(function(error) {
					$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
				})
			}
		})
	})

	$rootScope.$on('requestFetchData', function() {
		$scope.init();
	})

	$scope.init = function() {
		getBKBList();
	}

	$scope.exportToExcel = function(){
		location.href = api.url + "report/inventory/bkb/list?accessToken=" + accessToken + '&id=' + $scope.requiredData.id + '&do_id=' + $scope.requiredData.do_id + '&date=' + $scope.requiredData.date + '&c_name=' + $scope.requiredData.c_name + "&s_date=" + $scope.requiredData.s_date + "&e_date=" + $scope.requiredData.e_date + '&export='+ true;
	}

	$timeout(function() { $scope.init(); }, 150);

	function getBKBList() {
		$bkbService.get.bkbList($scope.requiredData)
		.then(function(response) {
			console.log(response);
			for(var i=0; i<response.result.data.length; i++){
				response.result.data[i].doId = response.result.data[i].do.id;
				response.result.data[i].customerName = response.result.data[i].customer.name;
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
