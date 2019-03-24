distributionApp.controller('mutationController', function($scope, $rootScope,
	$mutationService, $modalService, $timeout, $myCookies) {

	'use strict';

	//	Table Headings
	var accessToken = $myCookies.get('accessToken');

	$scope.headings = [
		{ name: 'Tanggal' },
		{ name: 'No. DO' },
		{ name: 'Gudang Asal' },
		{ name: 'Gudang Tujuan' },
		{ name: 'Status Mutasi' }
	];

	$scope.searchFilters = [
		{ by: 'do', name: 'No. DO', placeholder: 'Masukkan nomor DO' },
		{ by: 'item_id', name: 'ID Barang', placeholder: 'Masukkan ID Barang'},
		{ by: 'item_name', name: 'Nama Barang', placeholder: 'Masukkan Nama Barang'},
		{ by: 'range_date', name: 'Range Tanggal', placeholder: ''}
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	};

	$scope.requiredData = {
		limit: 10,
		offset: 0,
		do: '',
		item_id: '',
		item_name: '',
		s_date: '',
		e_date: ''
	}

	$scope.setMutationStatus = function(status) {
		switch(status) {
			case 1: {
				return 'badge--primary';
				break;
			}
			case 2: {
				return 'badge--active';
				break;
			}
			case 3: {
				return 'badge--passive';
				break;
			}
			case -1: {
				return 'badge--danger';
				break;
			}
			case -2: {
				return 'badge--success';
				break;
			}
		}
	}

	$scope.exportToExcel = function(){
		location.href = api.url + "report/inventory/mutation/list?accessToken=" + accessToken + "&export=" + true + "&s_date=" + $scope.requiredData.s_date + "&e_date=" + $scope.requiredData.e_date + "&do=" + $scope.requiredData.do + "&item_id=" + $scope.requiredData.item_id + "&item_name=" + $scope.requiredData.item_name;
	}

	$scope.closeWithAdjustment = function(mutationId){
		var mutationToClose = {
			id: mutationId,
			type: 0
		}
		$mutationService.put.closeMutation(mutationToClose).then(response => {
			$rootScope.triggerModal("Mutasi telah ditutup dengan adjustment", "Success", "success", "/inventory/mutation");
		})
		.catch(error => {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

	$scope.closeWithCreateInvoice = function(mutationId){
		var mutationToClose = {
			id: mutationId,
			type: 1
		}
		$mutationService.put.closeMutation(mutationToClose).then(response => {
			$rootScope.triggerModal("Buatlah SO untuk missing item dan masukkan No SO di detail mutasi untuk benar2 menutup mutasi", "Success", "success", "/inventory/mutation");
		})
		.catch(error => {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

	$scope.closeMutationAndValidate = function(mutationId, soId){
		var mutationToValidate = {
			id: mutationId,
			so_id: soId
		}
		$mutationService.put.closeMutationAndValidate(mutationToValidate).then(response => {
			$rootScope.triggerModal("Mutasi berhasil ditutup", "Success", "success", "/inventory/mutation");
		})
		.catch(error => {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

	$scope.openMutationDetail = function(mutation) {
		var mutationId = mutation.id

		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/mutationDetail.html',
			size: 'lg'
		};

		$modalService.open(modalOptions).then(function(response){
			$mutationService.get.mutationDetail(mutationId)
				.then(function(response) {
					console.log(response.result);
					$scope.mutationDetail = response.result;
					$scope.itemHeadings = [
						{ name: 'Kategori' },
						{ name: 'Nama Barang' },
						{ name: 'Satuan' },
						{ name: 'Grade' },
						{ name: 'Jumlah' }
					];
					$scope.printMutation = function(mutationId){
						location.href = api.url + "mutation/print?accessToken=" + $myCookies.get("accessToken") + '&id=' + mutationId;
					}
					$scope.printDo = function(doId){
						location.href = api.url + "do/print?accessToken=" + $myCookies.get("accessToken") + '&id=' + doId;
					}
				})
				.catch(function(error) {
					console.warn(error);
				});
		})

	}


	$scope.doSearchFilter = function(val, type) {
		$scope.requiredData.offset = 0;
		switch(type) {
			case 'do': {
				$scope.requiredData.do = val;
				$scope.requiredData.item_id = "";
				$scope.requiredData.item_name = "";
				break;
			}
			case 'item_id': {
				$scope.requiredData.do = "";
				$scope.requiredData.item_id = val;
				$scope.requiredData.item_name = "";
				break;
			}
			case 'item_name': {
				$scope.requiredData.do = "";
				$scope.requiredData.item_id = "";
				$scope.requiredData.item_name = val;
				break;
			}
		}

		$scope.init();
	}

	$scope.init = function() {
		getMutationList();
	}

	/**
	 */
	$scope.$on('requestFetchData', function() {
		$scope.init();
	});

	$timeout(function() {
		$scope.init();
	}, 50);

	/**
	 *	@type Getters
	 *	@desc Set of functions that available to use to get data from Backend API.
	 */

	function getMutationList() {
		$mutationService.get.mutationList($scope.requiredData)
			.then(function(response) {
				$scope.mutations = response.result.data;
				$scope.totalRows = response.result.row;
				console.log(response);
				$scope.$apply();
			})
			.catch(function(error) {

			});
	}

});
