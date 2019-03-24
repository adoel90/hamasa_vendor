distributionApp.controller('createNewSalesContractController', function($scope, $rootScope,
	$salesService, $itemService, $customerService, $modalService, $window, $timeout, $moment) {

	'use strict';

	$( document ).ready(function() {
			$('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
	});

	$scope.requiredData = {
		contract_id: '',
		contract_start: '',
		contract_end: '',
		dp: '',
		percentage: 0,
		tonase: '',
		customer_id: '',
		item: [],
		category_id: null,
		selectedCategory: null
	}

	$scope.item = {
		headings: [
			{ name: 'Serial' },
			{ name: 'Kategori' },
			{ name: 'Nama Barang' },
			{ name: 'Berat (kg)'},
			{ name: 'Jumlah', size: 'sm' },
			{ name: 'Total (kg)'},
			{ name: 'Harga / kg', size: 'lg'},
			{ name: 'Harga / batang', size: 'lg'},
			{ name: 'Action', size: 'lg' },
		]
	}


	$scope.selectedCustomer = {};

	$scope.init = function() {
		var newDate = new Date();
		$scope.requiredData.contract_start = $moment(newDate).format('YYYY-MM-DD');
		getAllCustomers();
	}

	$timeout($scope.init, 50);

	var didShowAlert = false;
	$scope.makeSureThatPriceKgIsFilled = function(item){
		item.price = $rootScope.numberWithNoCommas(item.price);
		if(didShowAlert){
			didShowAlert = false;
		}
		else{
			if(item.priceKg == 0){
				$rootScope.triggerModal('Harga per Kg harus diisi terlebih dahulu', 'Error', 'danger', '');
				didShowAlert = true;
			}
			else if(isNaN($rootScope.numberWithNoCommas(item.priceKg))){
				$rootScope.triggerModal('Harga per Kg harus numeric', 'Error', 'danger', '');
				didShowAlert = true;
			}
		}
	}

	$scope.generateByCategory = function(){
		$itemService.get.allItemByCategory($scope.requiredData.category_id).then(response => {
			console.log(response);
			for(var i=0; i<response.result.length; i++){
				var item = response.result[i];
				$scope.requiredData.item.push({
					serial: item.serial,
					ig_id: item.ig_id,
					name: item.name,
					category: item.category.name,
					weight: item.weight,
					quantity: 0,
					total: 0,
					price: $rootScope.numberWithCommas(item.price.kredit_gudang),
					priceKg: item.weight ? $rootScope.roundToTwoDecimalPlaces(item.price.kredit_gudang / item.weight) : 0
				});
			}
			$scope.$apply();
		})
		.catch(error => {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}
	$scope.changeCustomer = function(customer) {
		$scope.selectedCustomer = customer;
		$scope.requiredData.customer_id = $scope.selectedCustomer.id;

		$timeout(getCustomerDetail(customer.id), 50);
	}

	$scope.saveChanges = function() {
		console.log($scope.requiredData);

		var dpValidationSucceed = true;
		var priceValidationSucceed = true;
		if(isNaN($rootScope.numberWithNoCommas($scope.requiredData.dp))){
			dpValidationSucceed = false;
		}
		else{
			$scope.requiredData.dp = $rootScope.numberWithNoCommas($scope.requiredData.dp);
		}

		for(var i=0; i< $scope.requiredData.item.length; i++){
			if(isNaN($rootScope.numberWithNoCommas($scope.requiredData.item[i].price))){
				priceValidationSucceed = false;
				break;
			}
			else{
				$scope.requiredData.item[i].price = $rootScope.numberWithNoCommas($scope.requiredData.item[i].price);
			}

		}

		setTimeout(()=>{
			$scope.requiredData.tonase = $rootScope.numberWithNoCommas($scope.requiredData.tonase);
			if(!dpValidationSucceed){
				$rootScope.triggerModal("DP harus numerik", "Error", "danger", "");
			}
			else if(!priceValidationSucceed){
				$rootScope.triggerModal("Harga harus numerik", "Error", "danger", "");
			}
			else{
				$salesService.post.createContract($scope.requiredData)
					.then(function(response) {
						$rootScope.triggerModal("Kontrak penjualan telah berhasil ditambahkan.", "Success", "success", "/sales/salescontract/");
					})
					.catch(function(error) {
						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
					})
			}
		}, 800);

	}

	$scope.deleteItem = function(index){
		$scope.requiredData.item.splice(index, 1);
	}

	$scope.doCalculate = function(item){
		item.price = $rootScope.roundToTwoDecimalPlaces($rootScope.numberWithNoCommas(item.weight) * $rootScope.numberWithNoCommas(item.priceKg));
		
		// item.price = $rootScope.numberWithNoCommas(item.weight) * $rootScope.numberWithNoCommas(item.priceKg);

		item.weight = $rootScope.numberWithCommas(item.weight);
		item.priceKg = $rootScope.numberWithCommas(item.priceKg);
		item.price = $rootScope.numberWithCommas(item.price);
	}

	// $scope.addItem = function() {
	// 	var modalOptions = {
	// 		scope: $scope,
	// 		size: 'lg',
	// 		templateUrl: '/dist/view/modal/addItem.html'
	// 	}
  //
	// 	$modalService.open(modalOptions)
	// 		.then(function(response) {
	// 			$scope.itemList = {
	// 				requiredData: {
	// 					limit: 10,
	// 					offset: 0,
	// 					id: '',
	// 					name: '',
	// 					category: '',
	// 					grade: '',
	// 					supplier: ''
	// 				},
	// 				firstSearchFilters: [
	// 					 {by: 'code', name: 'Kode Barang', placeholder: 'Masukkan kode barang'},
	// 					 {by: 'name', name: 'Nama Barang', placeholder: 'Masukkan nama barang'},
	// 					 {by: 'category', name: 'Kategori Barang', placeholder: 'Masukkan kategori barang'}
	// 				],
	// 				firstSelectedFilter: {
	// 					 item: {by: 'code', name: 'Kode Barang', placeholder: 'Masukkan kode barang'}
	// 				},
	// 				secondSearchFilters:[
	// 					{by: 'supplier', name: 'Supplier', placeholder: 'Masukkan Supplier'},
	// 					{by: 'grade', name: 'Grade', placeholder: 'Masukkan Grade'}
	// 				],
	// 				secondSelectedFilter:{
	// 					item: {by: 'supplier', name: 'Supplier', placeholder: 'Masukkan Supplier'}
	// 				},
	// 				headings: [
	// 					{ name: 'Kode Barang' },
	// 					{ name: 'Serial' },
	// 					{ name: 'Kategori' },
	// 					{ name: 'Nama Barang' },
	// 					{ name: 'Unit' },
	// 					{ name: 'Berat' },
	// 					{ name: 'Grade' },
	// 					{ name: 'Harga / Btg' }
	// 				]
	// 			}
  //
	// 			$scope.doSearchFilter = function(firstVal, firstSearchType, secondVal, secondSearchType) {
	// 				$scope.itemList.requiredData.offset = 0;
	// 				switch(firstSearchType){
	// 					case 'code':{
	// 						$scope.itemList.requiredData.id = firstVal ? firstVal : "";
	// 						$scope.itemList.requiredData.name = "";
	// 						$scope.itemList.requiredData.category = "";
	// 						break;
	// 					}
	// 					case 'name':{
	// 						$scope.itemList.requiredData.id = "";
	// 						$scope.itemList.requiredData.name = firstVal ? firstVal : "";
	// 						$scope.itemList.requiredData.category = "";
	// 						break;
	// 					}
	// 					case 'category':{
	// 						$scope.itemList.requiredData.id = "";
	// 						$scope.itemList.requiredData.name = "";
	// 						$scope.itemList.requiredData.category = firstVal ? firstVal : "";
	// 						break;
	// 					}
	// 				}
	// 				switch(secondSearchType){
	// 					case 'supplier':{
	// 						$scope.itemList.requiredData.supplier = secondVal ? secondVal : "";
	// 						$scope.itemList.requiredData.grade = "";
	// 						break;
	// 					}
	// 					case 'grade':{
	// 						$scope.itemList.requiredData.supplier = "";
	// 						$scope.itemList.requiredData.grade = secondVal ? secondVal : "";
	// 						break;
	// 					}
	// 				}
	// 				setTimeout(function(){
	// 					getItemPriceList();
	// 				},200);
	// 			}
  //
	// 			$rootScope.$on('requestFetchData', function() {
	// 				getItemPriceList();
	// 			})
  //
	// 			$scope.modalInit = function() {
	// 				getItemPriceList();
	// 			}
  //
	// 			$scope.chooseItem = function(item) {
  //
	// 				$scope.requiredData.item.push({
	// 					serial: item.serial,
	// 					ig_id: item.ig_id,
	// 					name: item.name,
	// 					category: item.category.name,
	// 					weight: item.weight,
	// 					quantity: 0,
	// 					total: 0,
	// 					price: $rootScope.numberWithCommas(item.price.kredit_gudang),
	// 					priceKg: item.weight ? $rootScope.roundToTwoDecimalPlaces(item.price.kredit_gudang / item.weight) : 0
	// 				});
	// 				console.log($scope.requiredData.item);
	// 				$modalService.close();
	// 			}
  //
	// 			$timeout($scope.modalInit, 50);
  //
	// 			function getItemPriceList() {
	// 				$itemService.get.priceList($scope.itemList.requiredData)
	// 					.then(function(response) {
	// 						console.log(response.result.data);
	// 						$scope.itemList.items = response.result.data;
	// 						$scope.totalRows = response.result.row;
	// 						$scope.$apply();
	// 					})
	// 			}
	// 		})
  //
  //
	// }

	$scope.$on("chooseItemInPriceList", function(event, args){
		var item = args.state.item;
		$scope.requiredData.item.push({
			serial: item.serial,
			ig_id: item.ig_id,
			name: item.name,
			category: item.category.name,
			weight: item.weight,
			quantity: 0,
			total: 0,
			price: $rootScope.numberWithCommas(item.price.kredit_gudang),
			priceKg: item.weight ? $rootScope.roundToTwoDecimalPlaces(item.price.kredit_gudang / item.weight) : 0
		});
	})

	function getAllCustomers() {
		$customerService.get.customer()
			.then(function(response) {
				$scope.customerList = response.result;
				$scope.$apply();

				$timeout(setInitialCustomer(), 50);
			})
			.catch(function(error) {
				console.warn(error);
			});
	}

	function setInitialCustomer() {
		$scope.selectedCustomer = $scope.customerList[0];
		$scope.requiredData.customer_id = $scope.customerList[0].id;

		getCustomerDetail($scope.requiredData.customer_id);
	}

	function getCustomerDetail(id) {
		$customerService.get.customerDetail(id)
			.then(function(response) {
				console.log(response);
				$scope.customerDetail = response.result;
				$scope.$apply();
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

})
