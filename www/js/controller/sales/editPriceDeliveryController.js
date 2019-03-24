distributionApp.controller('editPriceDeliveryController', function($scope, $rootScope, $deliveryService, $modalService) {
   $scope.priceDelivery = {};
   $rootScope.priceDeliveryId = encodeURIComponent(routeParams.id);

   $deliveryService.get.detailPriceDelivery(routeParams.id).then(function(response){
      $scope.priceDelivery = response.result;
      $scope.priceDelivery.capacity = $rootScope.numberWithCommas(response.result.capacity);
      $scope.priceDelivery.price = $rootScope.numberWithCommas(response.result.price);
      $scope.$apply();
   })
   .catch(function(error){
      console.log(error);
   })

   $scope.save = function(){
     if(isNaN($rootScope.numberWithNoCommas($scope.priceDelivery.capacity))){
       $rootScope.triggerModal("Kapasitas harus numerik", "Error", "danger", "");
     }
     else if(isNaN($rootScope.numberWithNoCommas($scope.priceDelivery.price))){
       $rootScope.triggerModal("Harga pengiriman harus numerik", "Error", "danger", "");
     }
     else{
       $scope.priceDelivery.capacity = $rootScope.numberWithNoCommas($scope.priceDelivery.capacity);
       $scope.priceDelivery.price = $rootScope.numberWithNoCommas($scope.priceDelivery.price);

       setTimeout(() => {
         $deliveryService.put.updatePriceDelivery($scope.priceDelivery).then(function(response){
           $rootScope.triggerModal("Harga Pengiriman berhasil diupdate.", "Success", "success", "/sales/pricedelivery");
         })
         .catch(function(error){
            $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
         })
       }, 150);

     }
   }
});
