distributionApp.controller('createNewSalesOrderController', function($scope, $rootScope,
	$salesService, $customerService, $modalService, $window, $timeout, $moment) {

	'use strict';

	$scope.tipoId = routeParams.tipo_id;
	$scope.page = "so";

	$scope.requiredData = {
		date: $moment(new Date()).format('YYYY-MM-DD'),
		pay_method: '',
		pickup: '',
		contract_id: '',
		tipo_id: '',
		customer_id: '',
		due_date: 0,
		item: [],
		sc_percent: null
	}

	$scope.page = "create so";
	
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
	];

	$scope.paymentMethodList = [
		{ id: 1, name: 'CASH' },
		{ id: 2, name: 'CREDIT' }
	]

	$scope.pickupMethodList = [
		{ id: 3, name: 'BPB' },
		{ id: 2, name: 'GUDANG' },
		{ id: 1, name: 'PABRIK' }
	]

	$scope.customerList = [];

	$scope.changeCustomer = function(item) {
		$scope.requiredData.customer_id = item.id;
		$scope.selectedCustomer = item;

		getCustomerDetail();
	}
	$scope.changePickupMethod = function(data){
		$scope.requiredData.pickup = data.id;
		$scope.requiredData.item = [];
		$scope.$apply();
	}

	$scope.changePaymentMethod = function(data){
		$scope.requiredData.pay_method = data.id;
		$scope.requiredData.item = [];
		$scope.$apply();
	}

	$scope.deleteItem = function(index){
		$scope.requiredData.item.splice(index, 1);
	}

	$scope.openContractList = function() {
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/addContract.html',
			size: 'lg'
		}

		$modalService.open(modalOptions)
			.then(function(response) {
				$scope.contractList = {
					requiredData: {
						limit: 10,
						offset: 0,
						contract_id: '',
						customer_name: '',
						s_date: '',
						e_date: ''
					},
					searchFilters: [
						{ by: 'contract_id', name: 'Nomor Kontrak', placeholder: 'Masukkan nomor kontrak' },
						{ by: 'customer_name', name: 'Nama Customer', placeholder: 'Masukkan nama customer' },
					],
					headings: [
						{ name: 'No. Kontrak' },
						{ name: 'Nama Customer' },
						{ name: 'Tanggal Kontrak' },
						{ name: 'Akhir Kontrak' }
					],
					items: [],
					totalRows: null
				}

				$scope.contractList.selectedFilter = {
					item: $scope.contractList.searchFilters[0]
				}

				$scope.doSearchFilter = function(val, by){
					$scope.contractList.requiredData.offset = 0;
					switch(by){
						case "contract_id":{
							$scope.contractList.requiredData.contract_id = val;
							$scope.contractList.requiredData.customer_name = "";
							break;
						}
						case "customer_name":{
							$scope.contractList.requiredData.contract_id = "";
							$scope.contractList.requiredData.customer_name = val;
							break;
						}
					}
					$scope.modalInit();
				}

				$scope.modalInit = function() {
					getContractList();
				}

				$timeout($scope.modalInit, 50);

				$scope.chooseContract = function(contract) {
					$scope.requiredData.contract_id = contract.id;
					$scope.requiredData.customer_id = contract.customer.id;
					for(var i=0; i<$scope.customerList.length; i++){
						if($scope.customerList[i].id == contract.customer.id){
							$scope.selectedCustomer = $scope.customerList[i];
							break;
						}
					}
					getContractDetailByContractId(contract.id);
					getCustomerDetail();
					$modalService.close();
				}

				function getContractList() {
					$salesService.get.contractList($scope.contractList.requiredData)
						.then(function(response) {
							$scope.contractList.items = response.result.data;
							$scope.totalRows = response.result.row;
							$scope.$apply();
						})
				}

			})
	}

	$scope.init = function() {
		getCustomerList();
		setInitialPaymentMethod();
		setInitialPickupMethod();
	}

	$timeout($scope.init, 50);

	function getContractDetailByContractId(id){
		$salesService.get.contractDetail(id).then(response => {
			console.log(response);
			$scope.contractDetail = response.result;
			$scope.$apply();
		})
		.catch(error => {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}
	$scope.triggerModal = function(customMessage, customTitle, modalType){
     var modalOptions = {
        scope: $scope
     }

     $modalService.alert(modalOptions)
        .then(function() {
           $scope.alert = {
              type: modalType,
              title: customTitle,
              message: customMessage,
              button: [
                 { type: modalType, text: 'Kembali' }
              ]
           }

           $scope.doAction = function(index) {
              switch(index) {
                 case 0: {
                    $modalService.close();
                    if(modalType == "success") window.history.back();
                    break;
                 }
              }
           }

        })
        .catch(function(error) {
           console.warn(error);
        })
  }


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
				$salesService.post.createSalesOrder($scope.requiredData)
				.then(function(response) {
					location.href = "/sales/salesorder";
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


	 $scope.$on('chooseItemInSalesPrice', function(event, args){
		 var item = args.state.item;
		 var warehouse = args.state.warehouse;
		 var selectedItem = {
			 ig_id: item.ig_id,
			 category: item.category.name,
			 name: item.name,
			 unit: item.unit,
			 grade: item.grade,
			 price: item.price.unit,
			 sell_price: $rootScope.numberWithCommas(item.price.unit),
			 quantity: '',
			 plan: warehouse.plan,
			 w_id: warehouse.id,
			 warehouse: warehouse.name,
			 note: ''
		 }
		 $scope.requiredData.item.push(selectedItem);
		 $modalService.close();
		
		 setTimeout(() => {$('table tr').find('input:eq(1)').focus();}, 70);
	 })

	 $scope.$on('chooseItemInSalesPriceForFactory', function(event, args){
		 var item = args.state.item;
		 if($scope.requiredData.pickup == 1){ //jika ambil di pabrik
			 var selectedItem = {
				 ig_id: item.ig_id,
				 category: item.category.name,
				 name: item.name,
				 unit: item.unit,
				 grade: item.grade,
				 price: item.price.unit,
				 sell_price: $rootScope.numberWithCommas(item.price.unit),
				 quantity: '',
				 plan: null,
				 w_id: null,
				 warehouse: null,
				 note: ''
			 }
			 $scope.requiredData.item.push(selectedItem);
			 $modalService.close();
		 }
		 setTimeout(() => {$('table tr').find('input:eq(1)').focus();}, 70);
	 })

	function validateTipo() {
		if(routeParams.tipo_id) {
			$scope.requiredData.tipo_id = routeParams.tipo_id;
		}
	}

	function getCustomerList() {
		$customerService.get.customer()
			.then(function(response) {
				$scope.customerList = response.result;
				$scope.$apply();

				$timeout(setInitialCustomer	, 50);
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	function setInitialCustomer() {
		$scope.requiredData.customer_id = $scope.customerList[0].id;
		$scope.selectedCustomer = $scope.customerList[0];

		getCustomerDetail();
	}


	function getCustomerDetail() {
		$customerService.get.customerDetail($scope.requiredData.customer_id)
			.then(function(response) {
				$scope.customerDetail = response.result;
				$scope.$apply();
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	function setInitialPaymentMethod() {
		$scope.requiredData.pay_method = $scope.paymentMethodList[0].id;
		$scope.selectedPaymentMethod = $scope.paymentMethodList[0];
	}

	function setInitialPickupMethod() {
		$scope.requiredData.pickup = $scope.pickupMethodList[0].id;
		$scope.selectedPickupMethod = $scope.pickupMethodList[0];
	}

});
