distributionApp
	.controller('createNewCashoutController', createNewCashoutController);

function createNewCashoutController($scope, $rootScope, $cashService, $modalService,
	$timeout, $window, $interval, $bankService, $myCookies, $customerService) {

	'use strict';
	$scope.page = 'cashout';
	var accessToken = $myCookies.get("accessToken");
	$scope.requiredData = {
		type: null,
		so_id: null,
		c_id: null,
		to: '',		// required
		note: '',	// required
		method: '',	// required
		total: '',	// required
		bank: '',
		proof: '',
		due_date: '',
		saldo: 0,
		selectedBank: null,
		selectedCashoutType: null,
		selectedPaymentMethod: null,
		selectedCustomer: null
	}

	$scope.$watch('requiredData', function(newVal) {
		console.log(newVal);
	}	)

	$scope.cashoutTypeList = [
		{ id: 0, name: 'Lain-lain' },
		// { id: 1, name: 'SO' }
		{ id: 1, name: 'Pengembalian Saldo'}
	]

	$scope.init = function() {
		setInitialCashoutType();
	}

	function getCustomerList() {
		$customerService.get.customer()
		.then(function(response) {
			$scope.customerList = response.result;
			$scope.customerList.splice(0, 0, {id: null, name: "-- Pilih Customer --"});
			$scope.requiredData.c_id = $scope.customerList[0].id;
			$scope.requiredData.selectedCustomer = $scope.customerList[0];
			$scope.$apply();
		})
		.catch(function(error) {
			console.warn(error);
		})
	}

	function setInitialCashoutType(){
		$scope.requiredData.selectedCashoutType = $scope.cashoutTypeList[0];
		$scope.requiredData.type = $scope.cashoutTypeList[0].id;
	}

	$scope.changeCashoutType = function(data){
		console.log(data);
		$scope.requiredData.type = data.id;
		if($scope.requiredData.type == 1){
			getCustomerList();
		}
	}

	$scope.changeCustomer = function(item) {
		$scope.requiredData.c_id = item.id;
		getCustomerSaldoByCustId(item.id);
	}
	
	function getCustomerSaldoByCustId(id){
		$customerService.get.customerDetail(id)
		.then(function(response) {
			$scope.requiredData.saldo = $rootScope.numberWithCommas(response.result.saldo);
			$scope.$apply();
		})
		.catch(function(error) {
			console.warn(error);
		})
	}

	$timeout($scope.init, 50);

	$scope.datepickerVisibility = false;

	$interval(function setInterval() {
		$scope.datepickerVisibility = !$scope.datepickerVisibility;
	}, 2500)


	$scope.saveChanges = function() {
		console.log($scope.requiredData);
		if($scope.requiredData.method > 0 && $scope.requiredData.bank == null){
      		$rootScope.triggerModal("Bank harus diisi jika metode pembayaran cek, giro atau transfer.", "Error", "danger", "");
		}
		else if($scope.requiredData.type === 1 && ($rootScope.numberWithNoCommas($scope.requiredData.total) > $rootScope.numberWithNoCommas($scope.requiredData.saldo))  ){
			$rootScope.triggerModal("Jumlah uang yg dikeluarkan tidak boleh lebih besar daripada saldo", "Error", "danger", "");
		}
		else{
			createCashout($scope.requiredData);
		}
	}

	function createCashout(data){
		$scope.requiredData.total = $rootScope.numberWithNoCommas($scope.requiredData.total);
		$scope.requiredData.saldo = $rootScope.numberWithNoCommas($scope.requiredData.saldo);
		setTimeout(() => {
			$cashService.post.createCashout(data)
				.then(function(response) {
					console.log(response);
					var redirectToBKK = api.url + "cash/out/print?accessToken=" + accessToken + "&id=" + response.result;
					$rootScope.triggerModal("Kas Keluar telah berhasil dibuat.", "Success", "success", redirectToBKK);
				})
				.catch(function(error) {
					$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
				})
		}, 150);
	}
}
