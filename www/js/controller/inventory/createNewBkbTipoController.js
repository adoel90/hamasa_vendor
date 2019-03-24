distributionApp.controller('createNewBkbTipoController', function($scope, $rootScope, $tipoService, $modalService, $myCookies){
   console.log('createNewBkbTipoController');
   $scope.bkbTipoData = {
      dotipo_id: '',
      transport_number: '',
      driver: '',
      item: []
   }
   $scope.headings = [
      {name: "Kategori"},
      {name: "Nama Barang"},
      {name: "Jumlah Ambil"},
      {name: "Jumlah Keluar"}
   ];

   $scope.searchByDoTipoId = function(id){
      getCustomerDataAndItemListByDoTipoId(id);
   }
   function getCustomerDataAndItemListByDoTipoId(id){
      $tipoService.get.detailDo(id).then(function(response){
         console.log(response);
         $scope.customerData = {
            id: response.result.customer.id,
            name: response.result.customer.name,
            npwp: response.result.customer.npwp
         }
         for(var i=0; i<response.result.item.length; i++){
            $scope.bkbTipoData.item.push({
               ig_id: response.result.item[i].ig_id,
               category: response.result.item[i].category,
               name: response.result.item[i].name,
               quantityToTake: response.result.item[i].quantity,
               quantity: ''
            })
         }

         $scope.$apply();
      })
      .catch(function(error){
         var modalOptions = {
            scope: $scope
         }
         $modalService.alert(modalOptions)
            .then(function() {
               $scope.alert = {
                  type: 'danger',
                  title: 'Pencarian Gagal',
                  message: error.responseJSON.message,
                  button: [
                     { type: 'danger', text: 'Kembali' }
                  ]
               }

               $scope.doAction = function(index) {
                  switch(index) {
                     case 0: {
                        $modalService.close();
                     }
                  }
               }
            });
      })
   }

   $scope.doValidate = function(items){
      var errorFoundInQty = false;
      for(var i=0; i<items.length; i++){
         if(items[i].quantity > items[i].quantityToTake){
            errorFoundInQty = true;
            break;
         }
      }

      return errorFoundInQty;
   }

   $scope.save = function(){
      var validationNotSucceed = $scope.doValidate($scope.bkbTipoData.item);

      setTimeout(function(){
         if(validationNotSucceed){
            $rootScope.triggerModal("Jumlah keluar tidak boleh lebih besar daripada jumlah ambil", "Error", "danger", "");
         }
         if(!validationNotSucceed){
            createNewBkbTipo($scope.bkbTipoData);
         }
      },300);
   }

   function createNewBkbTipo(data){
      $tipoService.post.createBkbTipo(data).then(function(response){
         var redirectPrintBkbTipo = api.url + "tipo/bkb/print?accessToken=" + $myCookies.get("accessToken") + "&id=" + response.result;
         $rootScope.triggerModal("BKB TIPO berhasil dibuat", "Success", "success", redirectPrintBkbTipo); 
      })
      .catch(function(error){
         $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
   }
});
