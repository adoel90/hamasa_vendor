distributionApp
	.controller('taxSerialMasterController', taxSerialMasterController);

function taxSerialMasterController($scope, $rootScope, $taxService, $modalService, $timeout, $window, $myCookies) {
	'use strict';

	$scope.taxSerialMaster = {
		requiredData: {
			limit: 10,
			offset: 0
		},
		headings: [
			{ name: 'Tanggal Mulai' },
			{ name: 'Tanggal Berakhir' },
			{ name: 'Seri Awal', size: 'lg' },
			{ name: 'Seri Terakhir', size: 'lg' },
			{ name: 'Action'}
		],
		create: {
			requiredData: {
				serial_start: '',
				serial_end: '',
				start_date: '',
				end_date: ''
			}
		}
	}

	var accessToken = $myCookies.get('accessToken');
	
	$scope.createNewTaxSerial = function() {
		console.log($scope.taxSerialMaster.create.requiredData);

		$taxService.post.createTaxSerial($scope.taxSerialMaster.create.requiredData)
			.then(function(response) {
				var modalOptions = {
					scope: $scope
				}

				$modalService.alert(modalOptions)
					.then(function(response) {
						$scope.alert = {
							type: 'success',
							title: 'Sukses',
							message: 'Seri Pajak berhasil ditambahkan.',
							button: [
								{ type: 'success', text: 'Kembali' }
							]
						}

						$scope.doAction = function(index) {
							switch(index) {
								case 0: {
									$modalService.close();
									$window.location.reload();
									break;
								}
							}
						}
					})
			})
			.catch(function(error) {
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
			});
	}

	$scope.init = function() {
		getTaxSerialList();
	}

	$timeout($scope.init, 50);

	$scope.deleteTax = function(taxId){
		var data = {
			id: taxId
		}
		$rootScope.deleteConfirmationModal("Apakah Anda yakin ingin menghapus master seri pajak?", "Ya", "Tidak", function(){
			$taxService.delete.deleteTax(data).then(response => {
				$rootScope.triggerModal("Tax serial berhasil dihapus", "Success", "success", "/finance/taxserialmaster");
			})
			.catch(error => {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "error", "");
			})
		})
	}

	function getTaxSerialList() {
		$taxService.get.taxSerialList($scope.taxSerialMaster.requiredData)
		.then(function(response) {
			angular.extend($scope.taxSerialMaster, response.result);
			console.log($scope.taxSerialMaster);
			$scope.$apply();
		})
		.catch(function(error) {

		})
	}

	$scope.exportToExcel = function(){
		location.href = api.url + 'report/finance/tax/serial?accessToken=' + accessToken + '&export=' + true;
	}

}
