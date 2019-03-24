distributionApp
	.controller('billingController', billingController);

function billingController($scope, $rootScope, $billingService, $modalService, $timeout, $window, $myCookies, $bankService, $moment) {
	'use strict';

	var accessToken = $myCookies.get("accessToken");

	$scope.billing = {
		requiredData: {
			print: false,
			date: $moment(new Date()).format('YYYY-MM-DD'),
			region: ''
		},
		headings: [
			
			{ name: 'Nama Customer', rowspan: '2' },
			{ name: 'Nomor Invoice', rowspan: '2' },
			{ name: 'Nilai Invoice', rowspan: '2' },
			{ name: 'Jatuh Tempo', rowspan: '2' },
			{ name: 'No. Nota Tukar', rowspan: '2' },
			{ name: 'Pembayaran', colspan: '5' }
		],
		subheadings: [
			{ name: 'Jenis Pembayaran' },
			{ name: 'No. Bukti Pembayaran' },
			{ name: 'Jatuh Tempo' },
			{ name: 'Jumlah' },
			{ name: 'Action', rowspan: '2' }
		]
	}

	$scope.firstSearchFilters = [
		{by: "date", name: "Tanggal Penagihan", placeholder: "Masukkan Tanggal Penagihan"}
	];

	$scope.secondSearchFilters = [
		{by: "region", name: "Region", placeholder: "Masukkan Region"}
	];

	$scope.firstSelectedFilter = {
		item: $scope.firstSearchFilters[0]
	}
	$scope.secondSelectedFilter = {
		item: $scope.secondSearchFilters[0]
	}

	$scope.doSearchFilter = function(){
		console.log($scope.billing.requiredData);
		$scope.init()
	}

	$scope.paymentMethodList = [
		{ id: 0, name: 'Tunai' },
		{ id: 1, name: 'Transfer' },
		{ id: 2, name: 'Cek' },
		{ id: 3, name: 'Giro' },
	]

	$scope.bankList = [];


	$scope.openBillingDetail = function(invoiceId) {
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/editBilling.html',
			size: 'lg'
		}

		$modalService.open(modalOptions)
			.then(function() {
				$scope.editBilling = {
					requiredData: {
						invoice: invoiceId,
						note: '',
						pay_method: '',
						total: '',
						bank: null,
						selectedBank: '',
						proof: '',
						due_date: '',
						info: '',
						eInvoiceStatus: false,
						suratJalanStatus: false,
						efaktur: '',
						sj: ''
					}
				}

				$scope.changePaymentMethod = function(item) {
					$scope.editBilling.selectedPaymentMethod = item;
					$scope.editBilling.requiredData.pay_method = item.id;
					console.log($scope.billingDetail);
				}

				$scope.modalInit = function() {
					getBillingDetail($scope.editBilling.requiredData);
					getBankList();
					$timeout(setPaymentMethod, 50);
				}

				$scope.generateSuratJalanDate = function(suratJalanStatus){
					if(suratJalanStatus){
						$scope.editBilling.requiredData.sj = $moment(new Date()).format('YYYY-MM-DD');
					}
				}
				$scope.generateEFakturDate = function(eFakturStatus){
					if(eFakturStatus){
						$scope.editBilling.requiredData.efaktur = $moment(new Date()).format('YYYY-MM-DD');
					}
				}

				$timeout($scope.modalInit, 50);

				function getBankList(){
					$bankService.get.allBank().then(response => {
						$scope.bankList = response.result;
						$scope.bankList.splice(0, 0, {account: null, bank: "-- Pilih Bank --"});

						setTimeout(()=>{
							$scope.editBilling.requiredData.selectedBank = $scope.bankList[0];
							$scope.$apply();
						},150);
					})
					.catch(error => {
						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
					})
				}

				$scope.changeBank = function(data){
					$scope.editBilling.requiredData.bank = data.account;
				}

				$scope.saveChanges = function() {
					console.log($scope.editBilling.requiredData);
					handleTotal();

					$billingService.post.updateBilling($scope.editBilling.requiredData)
						.then(function(response) {
							var modalOptions = {
								scope: $scope
							}

							$modalService.alert(modalOptions)
								.then(function(response) {
									$scope.alert = {
										type: 'success',
										title: 'Sukses',
										message: 'Data penagihan telah berhasil diubah.',
										button: [
											{ type: 'success', text: 'Kembali' }
										]
									}

									$scope.doAction = function(index) {
										switch(index) {
											case 0: {
												$modalService.close();
												$window.history.back();
												break;
											}
										}
									}
								})
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

				function getBillingDetail(billingDetail) {
					$billingService.get.billingDetail(billingDetail.invoice)
						.then(function(response) {
							console.log(response);
							$scope.billingDetail = response.result;
							$scope.editBilling.requiredData = {
								invoice: billingDetail.invoice,
								note: $scope.billingDetail.note,
								pay_method: $scope.billingDetail.payment.method,
								total: $scope.billingDetail.payment.total,
								bank: $scope.billingDetail.payment.bank,
								proof: $scope.billingDetail.payment.proof,
								due_date: $scope.billingDetail.payment.due_date,
								info: $scope.billingDetail.info,
								efaktur: $moment($scope.billingDetail.efaktur).format('YYYY-MM-DD'),
								sj: $moment($scope.billingDetail.sj).format('YYYY-MM-DD'),
								eInvoiceStatus: $scope.billingDetail.efaktur ? true: false,
								suratJalanStatus: $scope.billingDetail.sj ? true : false,
							}
							setTimeout(() => {
								for(var i=0; i < $scope.paymentMethodList.length; i++){
									if($scope.paymentMethodList[i].id == $scope.editBilling.requiredData.pay_method){
										$scope.editBilling.requiredData.selectedPaymentMethod = $scope.paymentMethodList[i];
										break;
									}
								}
								for(var i=0; i < $scope.bankList.length; i++){
									if($scope.bankList[i].account == $scope.editBilling.requiredData.bank){
										$scope.editBilling.requiredData.selectedBank = $scope.bankList[i];
										break;
									}
								}
								$scope.$apply();
							}, 250);
							
						})
						.catch(function(error) {
							console.warn(error);
						})
				}

				function setPaymentMethod() {
					if($scope.editBilling.requiredData.pay_method) {
						angular.forEach($scope.paymentMethodList, function(paymentMethod) {
							if(paymentMethod.id === $scope.editBilling.requiredData.pay_method) {
								$scope.editBilling.selectedPaymentMethod = paymentMethod;
								$scope.editBilling.requiredData.pay_method = paymentMethod.id;
								$scope.$apply();
							}
						});

					} else {
						$scope.editBilling.selectedPaymentMethod = $scope.paymentMethodList[0];
						$scope.editBilling.requiredData.pay_method = $scope.paymentMethodList[0].id;
					}
				}

				function handleTotal() {
					$scope.editBilling.requiredData.total = $scope.editBilling.requiredData.total.replace(/\,/g,'');

				}
			})
	}

	$scope.doPrint = function(){
		if($scope.billing.requiredData.region){
			location.href = api.url + "billing/list?accessToken=" + accessToken + '&print=true&date=' + $scope.billing.requiredData.date + '&region=' + $scope.billing.requiredData.region;
		}
		else{
			location.href = api.url + "billing/list?accessToken=" + accessToken + '&print=true&date=' + $scope.billing.requiredData.date;
		}
		
	}

	$scope.init = function() {
		getBillingList();
	}

	$timeout($scope.init, 50);

	function getBillingList() {
		$billingService.get.billingList($scope.billing.requiredData)
			.then(function(response) {
				$scope.billing.billingList = response.result;
				$scope.$apply();
				console.log(response);
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	$scope.exportToExcel = function(){
		location.href = api.url + 'report/finance/billing/list?accessToken=' + accessToken + '&export=' + true + '&date=' + $scope.billing.requiredData.date ;
	}

}
