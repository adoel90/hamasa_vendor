distributionApp.controller('createNewQuotationController', function($scope, $rootScope,
	$quotationService, $customerService, $salesService, $modalService, $window, $timeout, $moment) {

	'use strict';

	$scope.requiredData = {
		date: $moment(new Date()).format('YYYY-MM-DD'),
		customer_id: '',
		pay_method: '',
		pickup: '',
		due_date: 0,
		item: []
	}

	$scope.page = 'quotation';

	$scope.headings = [
		{ name: 'Kategori', width: "15%" },
		{ name: 'Nama Barang', width: "25%" },
		{ name: 'Satuan', width: "5%" },
		{ name: 'Gudang', width: "15%" },
		{ name: 'Grade', width: "5%" },
		{ name: 'Harga Jual', width: "10%" },
		{ name: 'Jumlah', width: "10%" },
		{ name: 'Keterangan', width: "10%" },
		{ name: 'Action', width: "auto" }
	]

	$scope.paymentMethodList = [
		{ id: 1, name: 'CASH' },
		{ id: 2, name: 'CREDIT' }
	]

	$scope.pickupMethodList = [
		{ id: 2, name: 'GUDANG' },
		{ id: 1, name: 'PABRIK' }
	]

	//
	$scope.changeCustomer = function(customer) {
		$scope.selectedCustomer = customer;
		$scope.requiredData.customer_id = customer.id;

		getCustomerDetail();
	}

	$scope.changePaymentMethod = function(paymentMethod) {
		$scope.selectedPaymentMethod = paymentMethod;
		$scope.requiredData.pay_method = paymentMethod.id;
		$scope.requiredData.item = [];
		$scope.$apply();
	}

	$scope.changePickup = function(pickup) {
		$scope.selectedPickup = pickup;
		$scope.requiredData.pickup = pickup.id;
		$scope.requiredData.item = [];
		$scope.$apply();
	}

	$scope.deleteItem = function(index){
		$scope.requiredData.item.splice(index, 1);
	}

	$scope.$on("chooseItemInSalesPrice", function(event, args){
		var item = args.state.item;
		var warehouse = args.state.warehouse;
		var selectedItem = {
			ig_id: item.ig_id,
			category: item.category.name,
			name: item.name,
			unit: item.unit,
			grade: item.grade,
			price: item.price.unit,
			sell_price: item.price.unit,
			quantity: '',
			plan: warehouse.plan,
			w_id: warehouse.id,
			warehouse: warehouse.name,
			note: ''
		}

		$scope.requiredData.item.push(selectedItem);
		$modalService.close();
	})

	$scope.$on("chooseItemInSalesPriceForFactory", function(event, args){
		var item = args.state.item;
		var selectedItem = {
			ig_id: item.ig_id,
			category: item.category.name,
			name: item.name,
			unit: item.unit,
			grade: item.grade,
			price: item.price.unit,
			sell_price: item.price.unit,
			quantity: '',
			plan: null,
			w_id: null,
			warehouse: null,
			note: ''
			}

		$scope.requiredData.item.push(selectedItem);
		$modalService.close();
	});

	$scope.addItemPrice = function() {
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/addItemPrice.html',
			size: 'lg'
		}

		$modalService.open(modalOptions)
			.then(function(response) {
				$scope.itemPriceList = {
					requiredData: {
						limit: 10,
						offset: 0,
						pay_method: $scope.requiredData.pay_method,
						pickup: $scope.requiredData.pickup,
						contract_id: '',
						name: '',
						category: '',
						id: '',
						supplier: '',
						grade: ''
					},
					headings: [],
					firstSearchFilters: [
						{by: 'code', name: 'Kode Barang', placeholder: 'Masukkan kode barang'},
						{by: 'name', name: 'Nama Barang', placeholder: 'Masukkan nama barang'},
						{by: 'category', name: 'Kategori Barang', placeholder: 'Masukkan kategori barang'}
					],
					firstSelectedFilter: {
						 item: {by: 'code', name: 'Kode Barang', placeholder: 'Masukkan kode barang'}
					},
					secondSearchFilters: [
						{by: 'supplier', name: 'Supplier', placeholder: 'Masukkan Supplier'},
						{by: 'grade', name: 'Grade', placeholder: 'Masukkan Grade'}
					],
					secondSelectedFilter: {
						item: {by: 'supplier', name: 'Supplier', placeholder: 'Masukkan Supplier'},
					}
				}

				$scope.doSearchFilter = function(firstVal, firstSearchType, secondVal, secondSearchType) {

					$scope.itemPriceList.requiredData.offset = 0;
					switch(firstSearchType){
						case 'code':{
							$scope.itemPriceList.requiredData.id = firstVal ? firstVal : "";
							$scope.itemPriceList.requiredData.name = "";
							$scope.itemPriceList.requiredData.category = "";
							break;
						}
						case 'name':{
							$scope.itemPriceList.requiredData.id = "";
							$scope.itemPriceList.requiredData.name = firstVal ? firstVal : "";
							$scope.itemPriceList.requiredData.category = "";
							break;
						}
						case 'category':{
							$scope.itemPriceList.requiredData.id = "";
							$scope.itemPriceList.requiredData.name = "";
							$scope.itemPriceList.requiredData.category = firstVal ? firstVal : "";
							break;
						}
					}
					switch(secondSearchType){
						case 'supplier':{
							$scope.itemPriceList.requiredData.supplier = secondVal ? secondVal : "";
							$scope.itemPriceList.requiredData.grade = "";
							break;
						}
						case 'grade':{
							$scope.itemPriceList.requiredData.supplier = "";
							$scope.itemPriceList.requiredData.grade = secondVal ? secondVal : "";
							break;
						}
					}
					$timeout($scope.modalInit(), 250);
				}



				$scope.chooseItem = function(item, warehouse) {
					var selectedItem = {
						ig_id: item.ig_id,
						category: item.category.name,
						name: item.name,
						unit: item.unit,
						grade: item.grade,
						price: item.price.unit,
						sell_price: item.price.unit,
						quantity: '',
						plan: warehouse.plan,
						w_id: warehouse.id,
						warehouse: warehouse.name,
						note: ''
					}

					$scope.requiredData.item.push(selectedItem);
					$modalService.close();
					console.log($scope.requiredData);
				}

				$scope.chooseItemForFactory = function(item){
					if($scope.requiredData.pickup == 1){ //jika ambil di pabrik
						var selectedItem = {
							ig_id: item.ig_id,
							category: item.category.name,
							name: item.name,
							unit: item.unit,
							grade: item.grade,
							price: item.price.unit,
							sell_price: item.price.unit,
							quantity: '',
							plan: null,
							w_id: null,
							warehouse: null,
							note: ''
						}

						$scope.requiredData.item.push(selectedItem);
						$modalService.close();
					}

				}

				$scope.modalInit = function() {
					$timeout(getItemPriceList, 150);
				}

				$timeout($scope.modalInit, 50);

				$rootScope.$on('requestFetchData', function() {
				 	$timeout(getItemPriceList, 150);
				})

				function getItemPriceList() {

					$salesService.get.priceList($scope.itemPriceList.requiredData)
						.then(function(response) {
							console.log(response.result.data);
							$scope.itemPriceList.items = response.result.data;
							$scope.totalRows = response.result.row;
							$scope.itemPriceList.headings = [
								{ name: 'Kategori' },
								{ name: 'Nama Barang' },
								{ name: 'Satuan' },
								{ name: 'Berat' },
								{ name: 'Grade' },
								{ name: 'Harga' }
							];

							if($scope.requiredData.pickup == 2){

								angular.forEach($scope.itemPriceList.items[0].warehouse, function(warehouse) {
									var reqData = {
										name: warehouse.code
									}

									$scope.itemPriceList.headings.push(reqData);
								})
							}

							setTimeout(()=>{
								$scope.$apply();
							},150);

						})
						.catch(function(error) {
							console.warn(error);
						})
				}

			});
	}

	$scope.init = function() {
		getCustomerList();
		setInitialPaymentMethod();
		setInitialPickup();
	}

	$timeout($scope.init, 50);

	$scope.saveChanges = function() {
		var validationSucceed = true;

		for(var i=0; i<$scope.requiredData.item.length; i++){
			if(isNaN($rootScope.numberWithNoCommas($scope.requiredData.item[i].sell_price))){
				validationSucceed = false;
				break;
			}
			else{
				$scope.requiredData.item[i].sell_price = parseInt($rootScope.numberWithNoCommas($scope.requiredData.item[i].sell_price));
			}

			if(isNaN($rootScope.numberWithNoCommas($scope.requiredData.item[i].quantity))){
				validationSucceed = false;
				break;
			}
			else{
				$scope.requiredData.item[i].quantity = parseInt($rootScope.numberWithNoCommas($scope.requiredData.item[i].quantity));
			}
		}

		setTimeout(()=>{
			if(validationSucceed){
				$quotationService.post.createQuotation($scope.requiredData)
					.then(function(response) {
						$rootScope.triggerModal("Pembuatan penawaran telah berhasil.", "Success", "success", "/sales/quotation/");
					})
					.catch(function(error) {
						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
					})
			}
			else{
				$rootScope.triggerModal("Harga jual dan kuantitas barang harus numerik","Error","danger","");
			}
		}, 600);

	}

	function getCustomerList() {
		$customerService.get.customer()
			.then(function(response) {
				$scope.customerList = response.result;
				$scope.$apply(function() {
					$scope.selectedCustomer = $scope.customerList[0];
					$scope.requiredData.customer_id = $scope.customerList[0].id;

					getCustomerDetail();
				});
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	function getCustomerDetail() {
		$customerService.get.customerDetail($scope.selectedCustomer.id).then(function(response) {
			$scope.customerDetail = response.result;
			$scope.$apply();
		})
		.catch(error => {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

	function setInitialPaymentMethod() {
		$scope.selectedPaymentMethod = $scope.paymentMethodList[0];
		$scope.requiredData.pay_method = $scope.paymentMethodList[0].id;
	}

	function setInitialPickup() {
		$scope.selectedPickupMethod = $scope.pickupMethodList[0];
		$scope.requiredData.pickup = $scope.pickupMethodList[0].id;
	}

})
