distributionApp.controller('amandemenPurchasingContractController', function($scope, $modalService, $purchaseService, $window, $rootScope){
   $rootScope.contractId = encodeURIComponent(routeParams.id);
   $scope.headings = [
      {name: "Serial"},
      {name: "Kategori"},
      {name: "Nama Barang"},
      {name: "Satuan"},
      {name: "Grade"},
      {name: "Berat (kg)"},
      {name: "Jumlah"},
      {name: "Harga / kg", size: "lg"},
      {name: "Harga / unit", size: "lg"},
      {name: "Action"}
   ];

   $scope.requiredData = {
      limit: 10,
      offset: 0,
      id: routeParams.id
   }
   $scope.amandemenPurchasingContract = {};
   $scope.amandemenContractItem = [];
   $purchaseService.contract.get.purchasingContractDetail($scope.requiredData).then(function(response){
      console.log(response);
      response.result.end_date = response.result.end_date.split("-").reverse().join("-");
      response.result.date = response.result.date.split("-").reverse().join("-");
      response.result.dp = $rootScope.numberWithCommas(response.result.dp);
      response.result.tonase = $rootScope.numberWithCommas(response.result.tonase);

      for(var i=0; i<response.result.item.length; i++){
        if(response.result.item[i].weight){
          response.result.item[i].priceKg = $rootScope.numberWithCommas( $rootScope.roundToTwoDecimalPlaces(response.result.item[i].price / response.result.item[i].weight) );
        }
        else{
          response.result.item[i].priceKg = 0;
          response.result.item[i].price = $rootScope.numberWithCommas(response.result.item[i].price);
        }
        response.result.item[i].quantity = $rootScope.numberWithCommas(response.result.item[i].quantity);
      }
      $scope.amandemenPurchasingContract = response.result;
      $scope.amandemenContractItem = response.result.item;
      $scope.$apply();
   })
   .catch(function(error){
      console.log(error);
   })

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

   $scope.validateContractItemPriceAndQty = function(data){
      for(var i=0; i<data.length; i++){
        var qty = data[i].quantity.replace(/,/g , "");
        var price = data[i].price.replace(/,/g , "");
        return (isNaN(price) || isNaN(qty));
      }
   }

   $scope.save = function(){
      var validationError = false;
      setTimeout(() => {
        if(isNaN($scope.amandemenPurchasingContract.tonase.toString().replace(/,/g , ""))){
          $rootScope.triggerModal("Tonase harus numerik", "Error", "danger", "");
        }
        else{
          for(var i=0; i<$scope.amandemenContractItem.length; i++){
            var qty = $scope.amandemenContractItem[i].quantity.toString().replace(/,/g , "");
            var price = $scope.amandemenContractItem[i].price.toString().replace(/,/g , "");
            if(isNaN(qty) || isNaN(price)){
              validationError = true;
              $rootScope.triggerModal("Qty dan harga harus numerik", "Error", "danger", "");
              return;
            }
          }
        }

      },300);

      setTimeout( () => {
        if(!validationError){

           for(var i=0; i<$scope.amandemenContractItem.length; i++){
             $scope.amandemenContractItem[i].quantity = parseInt($scope.amandemenContractItem[i].quantity.toString().replace(/,/g , ""));
             $scope.amandemenContractItem[i].price = parseInt($scope.amandemenContractItem[i].price.toString().replace(/,/g , ""));
           }

           setTimeout(()=>{
             $scope.amandemenData = {
                id: $scope.amandemenPurchasingContract.id,
                end: $scope.amandemenPurchasingContract.end_date,
                tonase: parseInt($scope.amandemenPurchasingContract.tonase.toString().replace(/,/g , "")),
                item: $scope.amandemenContractItem
             }
             $purchaseService.contract.put.amandemenPurchaseContract($scope.amandemenData).then(function(response){
                $rootScope.triggerModal("Amandemen Kontrak Pembelian berhasil diupdate", "Success", "success", "/purchasing/purchasingcontract");
             })
             .catch(function(error){
                $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
             })
           },200);

        }
      }, 700);

   }
});
