distributionApp.controller('createNewPriceDeliveryController', function($scope, $rootScope, $deliveryService, $modalService) {
   console.log('createNewPriceDeliveryController');
   $scope.priceDelivery = {
      name: '',
      price: '',
      vehicle: '',
      capacity: ''
   }

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
        $deliveryService.post.createPriceDelivery($scope.priceDelivery).then(function(response){
          $rootScope.triggerModal("Harga Pengiriman berhasil ditambahkan.", "Success", "success", "/sales/pricedelivery");
        })
        .catch(function(error){
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }, 150);
    }
    
   }

});
