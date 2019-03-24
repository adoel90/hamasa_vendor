distributionApp.controller('salesContractController', function($scope, $rootScope,
	$customerService, $salesService, $modalService, $timeout, $window, $myCookies) {

	'use strict';

	var accessToken = $myCookies.get('accessToken');
	//	Table Headings
	$scope.headings = [
		{ name: 'No. Kontrak' },
		{ name: 'Tgl Kontrak' },
		{ name: 'Akhir Kontrak' },
		{ name: 'Untuk Customer' },
		{ name: 'Status'},
		{ name: 'Action' },
	];

	$scope.searchFilters = [
		{ by: 'contract_id', name: 'ID Kontrak Penjualan', placeholder: "Masukkan ID kontrak penjualan" },
		{ by: 'customer_name', name: 'Nama Customer', placeholder: "Masukkan nama customer" },
		{ by: 'range_date', name: 'Range Tanggal', placeholder: "" }
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}

	$scope.requiredData = {
		limit: 10,
		offset: 0,
		contract_id: '',
		customer_name: '',
		s_date: '',
		e_date: ''
	}

	$scope.redirectToAmandemenSalesContract = function(salesContractId){
		location.href = "/sales/salescontract/amandemensalescontract/" + encodeURIComponent(salesContractId);
	}

	$scope.printSalesContractReport = function(){
		location.href = api.url + "report/original/sale/contract?accessToken=" + accessToken + "&export=" + true + '&contract_id=' + $scope.requiredData.contract_id + '&customer_name=' + $scope.requiredData.customer_name + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date;
	}
	
	function defineContractStatus(status){
		if(status == -1) return 'Canceled';
		else if(status == 0) return 'Closed';
		else if(status == 1) return 'Active';
	}

	$scope.init = function() {
		$salesService.get.contractList($scope.requiredData).then(function(response) {
			console.log(response);
			$scope.contracts = response.result.data;
			$scope.totalRows = response.result.row;
			for(var i=0; i < $scope.contracts.length; i++){
				$scope.contracts[i].statusName = $scope.contracts[i].status.name;
			}
			$scope.$apply();
		})
		.catch(function(error) {
			console.log(error);
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		});
	}

	$scope.openContractDetail = function(contract) {
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/salesContractDetail.html',
			size: 'lg'
		}

		$modalService.open(modalOptions)
			.then(function() {
				$scope.item = {
					headings: [
						{ name: 'Kategori' },
						{ name: 'Nama Barang' },
						{ name: 'Satuan' },
						{ name: 'Grade' },
						{ name: 'Jumlah' },
						{ name: 'Harga' },
					]
				}
				$scope.amandement = {
					headings: [
						{ name: 'Tanggal' },
						{ name: 'Perubahan' }
					]
				}
				$salesService.get.contractDetail(contract.id)
					.then(function(response) {
						console.log(response);
						$scope.listFieldsInTheLeft = [
							{ name: "Nomor Kontrak", value: response.result.id, type: "text" },
							{ name: "Tanggal Kontrak", value: response.result.date, type: "text" },
							{ name: "Akhir Kontrak", value: response.result.end, type: "text" },
							{ name: "DP Kontrak", value: $rootScope.numberWithCommas(response.result.dp), type: "text" }
						];
						$scope.listFieldsInTheRight = [
							{ name: "ID Customer", value: response.result.customer.id, type: "text" },
							{ name: "Nama Customer", value: response.result.customer.name, type: "text" },
							{ name: "NPWP Customer", value: response.result.customer.npwp, type: "text" },
							{ name: "Tonase", value: $rootScope.numberWithCommas(response.result.customer.tonase), type: "text" }
						];
						for(var i=0; i < response.result.item.length; i++){
							response.result.item[i].categoryName = response.result.item[i].category.name;
						}
						$scope.contractDetailCols = [
							{name: "categoryName", type: "text"},
							{name: "name", type: "text"},
							{name: "unit", type: "text"},
							{name: "grade", type: "text"},
							{name: "quantity", type: "number"},
							{name: "price", type: "number"}
						];
						$scope.amandemenCol = ["date", "detail"];
						$scope.salesContractDetail = response.result;
						$scope.$apply();
					})
					.catch(function(error) {
						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
					})
			})
	}

	$scope.cancelSalesContract = function() {
		$rootScope.deleteConfirmationModal("Apakah Anda yakin ingin membatalkan kontrak penjualan ini?", "Ya", "Tidak", function(){
			var deleteData = {
				id: $scope.salesContractDetail.id
			}

			$salesService.delete.cancelContract(deleteData)
			.then(function(response) {
				$rootScope.triggerModal("Kontrak telah dibatalkan dan menunggu proses otorisasi", "Success", "success", "/sales/salescontract");
			})
			.catch(function(error) {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
		});
	}

	$scope.closeContract = function(salesContractId){
		$rootScope.deleteConfirmationModal("Apakah Anda yakin ingin melakukan closing terhadap kontrak penjualan ini?", "Ya", "Tidak", function(){
			var contractToClose = {
				id: salesContractId
			}

			$salesService.delete.closeSalesContract(contractToClose).then(response => {
				$rootScope.triggerModal("Kontrak berhasil diclosing", "Success", "success", "/sales/salescontract");
			})
			.catch(error => {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
		});
	}

	$scope.openSalesContractHistory = function(contract) {
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/salesContractHistory.html',
			size: 'lg'
		}

		$modalService.open(modalOptions);

		//
		$scope.salesContractHistory = {
			requiredData: {
				id: contract.id,
				history_limti: ''
			},
			headings: [
				{ name: 'Nomor SO' },
				{ name: 'Kategori' },
				{ name: 'Nama Barang' },
				{ name: 'Grade' },
				{ name: 'Berat' },
				{ name: 'Quantity' },
				{ name: 'Harga' },
				{ name: 'Total Harga' },
			]
		}

		$scope.modalInit = function() {
			getSalesContractHistory();
		}

		$timeout($scope.modalInit, 50)

		function getSalesContractHistory() {
			$salesService.get.contractHistory($scope.salesContractHistory.requiredData)
				.then(function(response) {
					console.log(response);
					angular.extend($scope.salesContractHistory, response.result);
					$scope.$apply();
				})
				.catch(function(error) {
					console.warn(error);
				})
		}
	}

	$scope.doSearchFilter = function(val, type) {
		switch(type) {
			case 'contract_id': {
				$scope.requiredData.contract_id = val;
				$scope.requiredData.customer_name = '';
				$scope.requiredData.s_date = '';
				$scope.requiredData.e_date = '';
				break;
			}
			case 'customer_name': {
				$scope.requiredData.contract_id = '';
				$scope.requiredData.customer_name = val;
				$scope.requiredData.s_date = '';
				$scope.requiredData.e_date = '';
				break;
			}
		}

		console.log($scope.requiredData);

		$scope.init();
	}

	$scope.$on('requestFetchData', function() {
		$scope.init();
	});

	setTimeout(function() {
		$scope.init();
	}, 500)
})
