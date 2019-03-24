distributionApp.controller('createNewSalesOrderForTipoController', function($scope, $rootScope, $customerService, $salesService, $modalService, $timeout){

  $rootScope.tipoId = encodeURIComponent(routeParams.id);
  $rootScope.custId = encodeURIComponent(routeParams.cust_id);
  $scope.requiredData = {
    customer_id: routeParams.cust_id,
    tipo_id: routeParams.id,
    contract_id: null,
    pickup: 2,
    pay_method: null,
    selectedPaymentMethod: null,
    due_date: null,
    item: []
  }

  $scope.paymentMethodList = [
		{ id: 1, name: 'CASH' },
		{ id: 2, name: 'CREDIT' }
	];

  $scope.headings = [
		{ name: 'Kategori' },
		{ name: 'Nama Barang' },
		{ name: 'Satuan' },
		{ name: 'Harga Jual', size: 'lg' },
		{ name: 'Jumlah' },
		{ name: 'Keterangan', size: 'lg' },
		{ name: 'Action'}
	];

  setTimeout(() => {
    $scope.init();
  }, 70);

  $scope.init = function(){
    initSelectedPaymentMethod();
    getCustomerDetail(routeParams.cust_id);
  }

  function initSelectedPaymentMethod(){
    $scope.requiredData.selectedPaymentMethod = $scope.paymentMethodList[0];
    $scope.requiredData.pay_method = $scope.paymentMethodList[0].id;
    $scope.requiredData.due_date = 0;
  }

  $scope.changePaymentMethod = function(data){
    $scope.requiredData.pay_method = data.id;
    $scope.requiredData.item = [];
  }

  function getCustomerDetail(custId){
    $customerService.get.customerDetail(custId).then(response => {
      console.log(response.result);
      $scope.customerDetail = response.result;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
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
      sell_price: $rootScope.numberWithCommas(item.price.unit),
      quantity: '',
      plan: warehouse.plan,
      w_id: warehouse.id,
      warehouse: warehouse.name,
      note: ''
    }

    $scope.requiredData.item.push(selectedItem);
    $modalService.close();
  })

  // $scope.openItemList = function(){
  //   var modalOptions = {
	// 		scope: $scope,
	// 		templateUrl: '/dist/view/modal/addItemPrice.html',
	// 		size: 'lg'
	// 	}
  //
	// 	$modalService.open(modalOptions)
	// 	.then(function(response) {
  //     $scope.itemPriceList = {
  //       requiredData: {
  //         limit: 10,
  //         offset: 0,
  //         pay_method: $scope.requiredData.pay_method,
  //         pickup: $scope.requiredData.pickup,
  //         contract_id: '',
  //         id: '',
  //         name: 'Jasa Potong',
  //         category: '',
  //         supplier: '',
  //         grade: ''
  //       },
  //       headings: [
  //         { name: 'Kategori'},
  //         { name: 'Nama Barang', size: 'lg'},
  //         { name: 'Unit'},
  //         { name: 'Berat' },
  //         { name: 'Grade' },
  //         { name: 'Harga' }
  //       ],
  //       items: [],
  //       totalRows: 0,
  //       firstSearchFilters: [
  //         { by: 'code', name: 'Kode Barang', placeholder: 'Masukkan kode barang' },
  //         { by: 'name', name:'Nama Barang', placeholder: 'Masukkan nama barang' },
  //         { by: 'category', name:'Kategori', placeholder: 'Masukkan kategori' },
  //       ],
  //       firstSelectedFilter: {
  //          item: {by: 'code', name: 'Kode Barang', placeholder: 'Masukkan kode barang'}
  //       },
  //       secondSearchFilters:[
  //         {by: 'supplier', name: 'Supplier', placeholder: 'Masukkan Supplier'},
  //         {by: 'grade', name: 'Grade', placeholder: 'Masukkan Grade'}
  //       ],
  //       secondSelectedFilter:{
  //         item: {by: 'supplier', name: 'Supplier', placeholder: 'Masukkan Supplier'},
  //       }
  //     }
  //
  //     $scope.chooseItem = function(item, warehouse) {
  //       console.log(item);
  //
  //       var selectedItem = {
  //         ig_id: item.ig_id,
  //         category: item.category.name,
  //         name: item.name,
  //         unit: item.unit,
  //         grade: item.grade,
  //         price: item.price.unit,
  //         sell_price: $rootScope.numberWithCommas(item.price.unit),
  //         quantity: '',
  //         plan: warehouse.plan,
  //         w_id: warehouse.id,
  //         warehouse: warehouse.name,
  //         note: ''
  //       }
  //
  //       $scope.requiredData.item.push(selectedItem);
  //       $modalService.close();
  //     }
  //
  //     $scope.doSearchFilter = function(firstVal, firstSearchType, secondVal, secondSearchType) {
  //
  //       $scope.itemPriceList.requiredData.offset = 0;
  //       switch(firstSearchType){
  //         case 'code':{
  //           $scope.itemPriceList.requiredData.id = firstVal ? firstVal : "";
  //           $scope.itemPriceList.requiredData.name = "";
  //           $scope.itemPriceList.requiredData.category = "";
  //           break;
  //         }
  //         case 'name':{
  //           $scope.itemPriceList.requiredData.id = "";
  //           $scope.itemPriceList.requiredData.name = firstVal ? firstVal : "";
  //           $scope.itemPriceList.requiredData.category = "";
  //           break;
  //         }
  //         case 'category':{
  //           $scope.itemPriceList.requiredData.id = "";
  //           $scope.itemPriceList.requiredData.name = "";
  //           $scope.itemPriceList.requiredData.category = firstVal ? firstVal : "";
  //           break;
  //         }
  //       }
  //       switch(secondSearchType){
  //         case 'supplier':{
  //           $scope.itemPriceList.requiredData.supplier = secondVal ? secondVal : "";
  //           $scope.itemPriceList.requiredData.grade = "";
  //           break;
  //         }
  //         case 'grade':{
  //           $scope.itemPriceList.requiredData.supplier = "";
  //           $scope.itemPriceList.requiredData.grade = secondVal ? secondVal : "";
  //           break;
  //         }
  //       }
  //
  //       $timeout(getItemPriceList, 150);
  //     }
  //
  //     $timeout(getItemPriceList, $timeout(updateHeadings, 550), 700);
  //
  //     $rootScope.$on('requestFetchData', function() {
  //       getItemPriceList();
  //     })
  //
  //     function getItemPriceList() {
  //       if($scope.requiredData.contract_id) {
  //         $scope.itemPriceList.requiredData.contract_id = $scope.requiredData.contract_id;
  //       }
  //
  //       $salesService.get.priceList($scope.itemPriceList.requiredData)
  //         .then(function(response) {
  //           console.log(response);
  //           $scope.itemPriceList.items = response.result.data;
  //           $scope.totalRows = response.result.row;
  //           $scope.$apply();
  //         })
  //         .catch(function(error) {
  //           console.warn(error);
  //         })
  //     }
  //
  //     function updateHeadings() {
  //       angular.forEach($scope.itemPriceList.items[0].warehouse, function(warehouse) {
  //         var headingsData = {
  //           name: warehouse.code
  //         }
  //
  //         $scope.itemPriceList.headings.push(headingsData);
  //       });
  //     }
  //
  //   })
  //
  // }

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
					var succeedUrl = '/sales/tipo/tipoinfo/' + encodeURIComponent(routeParams.id);
					$rootScope.triggerModal("Sales Order berhasil ditambahkan", "Success", "success", succeedUrl);
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

});
