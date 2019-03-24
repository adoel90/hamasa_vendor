distributionApp
	.controller('disbursementController', disbursementController);

function disbursementController($scope, $rootScope, $paymentService, $modalService, $timeout, $window, $bankService, $myCookies) {
	'use strict';

	$scope.paymentProof = {
		requiredData: {
			proof: '',
			selectedBank: null,
			bank: null,
			s_date: '',
			e_date: ''
		},
		headings: [
			{ name: 'Nomor SO' },
			{ name: 'Tanggal SO' },
			{ name: 'Jenis Pembayaran' },
			{ name: 'Total Pembayaran' },
			{ name: 'Jumlah Pelunasan' }
		]
	}

	var accessToken = $myCookies.get('accessToken');

	$scope.searchFilters = [
		{by: 'range_date', name: 'Range Tanggal'}
	]

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}
	
	$scope.bankList = null;

	$scope.searchPaymentProof = function() {
		getPaymentProof();
	}

	$scope.settleDisbursement = function() {
		settleDisbursement();
	}

	$bankService.get.allBank().then(response => {
		$scope.bankList = response.result;
		$scope.bankList.splice(0, 0, {account: null, bank: "-- Pilih Bank --"});

		setTimeout(()=>{
			$scope.paymentProof.requiredData.selectedBank = $scope.bankList[0];
			$scope.$apply();
		},200);

	})
	.catch(error => {
		console.log(error);
	})

	$scope.changeBank = function(data){
		$scope.paymentProof.requiredData.bank = data.account;
	}

	function settleDisbursement() {
		$paymentService.post.settleDisbursement($scope.paymentProof.requiredData)
			.then(function(response) {
				$rootScope.triggerModal("Pencairan giro atau cek berhasil.", "Success", "success", "/finance/disbursement");
			})
			.catch(function(error){
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
	}

	function getPaymentProof() {
		$paymentService.get.paymentProof($scope.paymentProof.requiredData)
			.then(function(response) {
				$scope.paymentProof.data = response.result;
				console.log($scope.paymentProof.data);
				$scope.$apply();
			})
			.catch(function(error) {
				console.warn(error);

				var modalOptions = {
					scope: $scope
				}

				$modalService.alert(modalOptions)
					.then(function(response) {
						$scope.alert = {
							type: 'danger',
							title: 'Perhatian',
							message: error.responseJSON.message,
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
			})
	}

	$scope.exportToExcel = function(){
		location.href = api.url + 'report/finance/cekgiro/list?accessToken=' + accessToken + '&export=' + true + '&s_date=' + $scope.paymentProof.requiredData.s_date + '&e_date=' + $scope.paymentProof.requiredData.e_date;
	}
}
