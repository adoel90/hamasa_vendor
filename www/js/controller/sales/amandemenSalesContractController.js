distributionApp.controller('amandemenSalesContractController', function($scope, $rootScope, $salesService, $timeout, $moment){
  $scope.headings = [
    {name: "Serial"},
    {name: "Kategori"},
    {name: "Nama Barang"},
    {name: "Satuan"},
    {name: "Grade"},
    {name: "Berat(kg)"},
    {name: "Jumlah"},
    {name: "Harga / kg", size: "lg"},
    {name: "Harga / unit", size: "lg"},
    {name: "Action"}
  ];

  $rootScope.contractId = encodeURIComponent(routeParams.id);
  $scope.amandemenSalesContract = null;

  $scope.doCalculate = function(item){
    item.price = $rootScope.roundToTwoDecimalPlaces($rootScope.numberWithNoCommas(item.weight) * $rootScope.numberWithNoCommas(item.priceKg));
		item.weight = $rootScope.numberWithCommas(item.weight);
		item.priceKg = $rootScope.numberWithCommas(item.priceKg);
		item.price = $rootScope.numberWithCommas(item.price);
  }

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

  $scope.init = function(){
    getSalesContractDetail(routeParams.id);
  }

  function getSalesContractDetail(id){
    $salesService.get.salesContractDetail(id).then(response => {
      console.log(response);
      $scope.amandemenSalesContract = {
        contract_id: response.result.id,
        date: response.result.date,
        contract_end: response.result.end,
        customer: response.result.customer,
        dp: response.result.dp,
        tonase: $rootScope.numberWithCommas(response.result.tonase),
        item: response.result.item
      }
      for(var i=0; i < $scope.amandemenSalesContract.item.length; i++){
        if($scope.amandemenSalesContract.item[i].weight){
          $scope.amandemenSalesContract.item[i].priceKg = $rootScope.numberWithCommas( $rootScope.roundToTwoDecimalPlaces($scope.amandemenSalesContract.item[i].price / $scope.amandemenSalesContract.item[i].weight) );
        }
        else{
          $scope.amandemenSalesContract.item[i].priceKg = 0;
          $scope.amandemenSalesContract.item[i].price = $rootScope.numberWithCommas($scope.amandemenSalesContract.item[i].price);
        }

        $scope.amandemenSalesContract.item[i].quantity = $rootScope.numberWithCommas($scope.amandemenSalesContract.item[i].quantity);
      }
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $timeout($scope.init(), 200);

  $scope.save = function(){
    var validationSucceed = true;
    for(var i=0; i < $scope.amandemenSalesContract.item.length; i++){
      if(isNaN($rootScope.numberWithNoCommas($scope.amandemenSalesContract.item[i].price))){
        validationSucceed = false;
        break;
      }
    }

    setTimeout(()=>{
      if(validationSucceed){
        $scope.amandemenSalesContract.tonase = parseInt($rootScope.numberWithNoCommas($scope.amandemenSalesContract.tonase));
        for(var i=0; i < $scope.amandemenSalesContract.item.length; i++){
          $scope.amandemenSalesContract.item[i].quantity = $rootScope.numberWithNoCommas($scope.amandemenSalesContract.item[i].quantity);
          $scope.amandemenSalesContract.item[i].price = $rootScope.numberWithNoCommas($scope.amandemenSalesContract.item[i].price);
        }
        $timeout(updateAmandemenContract($scope.amandemenSalesContract), 400);
      }
      else{
        $rootScope.triggerModal("Harga item harus numerik", "Error", "danger", "");
      }
    }, 600);
  }

  function updateAmandemenContract(data){
    $salesService.put.amandemenContract(data).then(response => {
      $rootScope.triggerModal("Amandemen Kontrak berhasil diupdate!", "Success", "success", "/sales/salescontract");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
})
