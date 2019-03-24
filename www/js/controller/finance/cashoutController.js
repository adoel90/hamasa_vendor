distributionApp
	.controller('cashoutController', cashoutController);

function cashoutController($scope, $rootScope, $cashService, $modalService, $timeout, $window, $myCookies) {

	'use strict';

	$scope.requiredData = {
		limit: 10,
		offset: 0,
		id: '',
		date: '',
		s_date: '',
		e_date: ''
	}

	var accessToken = $myCookies.get('accessToken');

	$scope.searchFilters = [
		{ by: 'id', name: 'Nomor Kas Keluar', placeholder: 'Masukkan nomor kas keluar' },
		{ by: 'date', name: 'Tanggal Kas Keluar', placeholder: 'Masukkan tanggal kas keluar' },
		{ by: 'range_date', name: "Range Tanggal"}
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}

	$scope.headings = [
		{ name: 'No. Kas Keluar', size: 'sm' },
		{ name: 'Tanggal' },
		{ name: 'Tujuan Pembayaran' },
		{ name: 'Keterangan Pembayaran', size: 'lg' }
	]

	$scope.cols = ['id', 'date', 'to', 'note'];
  $scope.btnName = "Buat Kas Keluar";
  $scope.tableType = 'non-edited-table';

	$scope.redirectToCreateNewData = function() {
		location.href = '/finance/cashout/createnewcashout';
	}

	$scope.doSearchFilter = function(val, type) {
		$scope.requiredData.offset = 0;
		switch(type) {
			case 'id': {
				$scope.requiredData.id = val;
				$scope.requiredData.date = '';
				break;
			}
			case 'date': {
				$scope.requiredData.id = '';
				$scope.requiredData.date = val;
				break;
			}
		}
		getCashoutList();
	}

	function definePaymentMethodName(method){
    if(method == 0){ return 'Tunai'; }
    else if(method == 1){ return 'Transfer'; }
    else if(method == 2){ return 'Cek'; }
    else if(method == 3){ return 'Giro'; }
  }

	$scope.$on("openDetailDataInTable", function(event, args){
		$scope.modalName = "Detail Kas Keluar";
		var cashoutId = args.state.data.id;
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/cashoutDetail.html',
			size: 'lg'
		}

		$modalService.open(modalOptions)
		.then(function(response) {
			$scope.modalInit = function() {
				getCashoutDetail(cashoutId);
			}

			$timeout($scope.modalInit, 50);

		})
	});

	function getCashoutDetail(id) {
		$cashService.get.cashoutDetail(id)
			.then(function(response) {
				console.log(response);
				$scope.listFieldsInTheLeft = [
					{ name: "Nomor Kas Keluar", value: response.result.id, type: "text" },
					{ name: "Tanggal Kas Keluar", value: response.result.date, type: "text" },
					{ name: "Tujuan Pembayaran", value: response.result.to, type: "text" },
					{ name: "Catatan", value: response.result.note, type: "textarea" }
				];
				$scope.listFieldsInTheRight = [
					{ name: "Jumlah Pembayaran", value: $rootScope.numberWithCommas(response.result.total), type: "text" },
					{ name: "Metode Pembayaran", value: definePaymentMethodName(response.result.method), type: "text" },
					{ name: "Bank Pembayaran", value: response.result.bank, type: "text", hide: response.result.method == 0 ? true : false },
					{ name: "Nomor Bukti Pembayaran", value: response.result.proof, type: "text", hide: response.result.method == 0 ? true : false },
					{ name: "Tanggal Jatuh Tempo", value: response.result.due_date, type: "text", hide: (response.result.method == 0 || response.result.method == 1) ? true : false }
				];
				setTimeout(() => { $scope.$apply(); }, 150);
			})
			.catch(function(error) {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
	}

	$scope.init = function() {
		getCashoutList();
	}

	$timeout($scope.init(), 100);

	function getCashoutList() {
		$cashService.get.cashoutList($scope.requiredData).then(function(response) {
			$scope.listData = response.result.data;
			$scope.totalRows = response.result.row;
			$scope.$apply();
		})
		.catch(function(error) {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

	$scope.exportToExcel = function(){
		location.href = api.url + 'report/finance/cash/out?accessToken=' + accessToken + '&export=' + true + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date;
	}

	$scope.$on('requestFetchData', function() {
		$scope.init();
	});

}
