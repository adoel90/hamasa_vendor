distributionApp.controller('createNewSpkController', function($scope, $rootScope, $spkService, $modalService) {
   $rootScope.tipoId = routeParams.id;
   $scope.headings = [
      {name: "Kategori"},
      {name: "Nama Barang", size: "lg"},
      {name: "Keterangan"},
      {name: "Quantity"},
      {name: "Action"}
   ];

   $scope.spkData = {
      so_id: '',
      ti_id: '',
      quantity: '',
      item: []
   }

   $scope.itemToBeCut = null;
   $scope.customerData = null;

   $scope.showCustomerDataBySoNumb = function(id){
      $spkService.get.customerDataBySoNumb(id).then(function(response){
        if(response.result.pay_method == 1 && response.result.payment_status == 0){
          $rootScope.triggerModal("Spk dengan pembayaran cash, invoice harus dilunaskan terlebih dahulu", "Error", "danger", "");
        }
        else{
          $scope.customerData = {
             name: response.result.customer.name,
             npwp: response.result.customer.npwp
          }
          $scope.$apply();
        }
      })
      .catch(function(error){
         $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
   }
   $scope.showItemListToBeCut = function(id){
      var modalOptions = {
         scope: $scope,
    			templateUrl: '/dist/view/modal/addSpkItem.html',
    			size: 'lg'
      }
      $modalService.open(modalOptions)
		.then(function(response) {
         $scope.spkItemList = [];
         $scope.detailHeadings = [
            {name: "Serial"},
            {name: "Nama", size: "lg"},
            {name: "Kategori"},
            {name: "Berat"},
            {name: "Keterangan"},
            {name: "Quantity"}
         ];

         $scope.item = {
            name: '',
            category: ''
         }

         $scope.search = {};

         $scope.searchFilters = [
            {by: "name", name: "Nama Barang", placeholder: "Masukkan Nama Barang"},
            {by: "category", name: "Kategori Barang", placeholder: "Masukkan Kategori Barang"}
         ];

         $scope.selectedFilter = {
            item: $scope.searchFilters[0]
         }

         $scope.doSearchFilter = function(filterBy){
            for(prop in $scope.item){
               if(filterBy != prop){
                  $scope.search[prop] = "";
               }
               else{
                  $scope.search[prop] = $scope.item[prop];
               }
            }
         }

         $scope.selectSpkItemToBeCut = function(item){
            $scope.itemToBeCut = {
               serial: item.serial,
               name: item.name,
               weight: item.weight,
               note: item.note
            }
            $scope.spkData.ti_id = item.id;

            $modalService.close();
         }


         $spkService.get.itemListForSpk(id).then(function(response){
            console.log(response);
            for(var i=0; i<response.result.length; i++){
               $scope.spkItemList.push({
                  id: response.result[i].id,
                  serial: response.result[i].serial,
                  name: response.result[i].name,
                  category: response.result[i].category,
                  weight: response.result[i].weight,
                  note: response.result[i].note,
                  quantity: response.result[i].quantity
               });
            }
         })
         .catch(function(error){
            console.log(error);
         })

         $scope.$on('requestFetchData', function(event, args) {
      		$scope.init();
      	});
      })
      .catch(function(error){
         console.log(error);
      })
   }

   $scope.$on("chooseItemInMasterList", function(event, args){
     var item = args.state.item;
     console.log(item);
     $scope.spkData.item.push({
        name: item.name,
        category: item.category.name,
        description: '',
        quantity: ''
     })
   })

   function getItemListForCuttingResult(data, spkCuttingResultList){
      $spkService.get.itemListForSpkResult($scope.requiredData).then(function(response){
         console.log(response);
         $scope.itemCuttingResultList = response.result.data;
         $scope.totalRows = response.result.row;
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   $scope.deleteItem = function(index){
      $scope.spkData.item.splice(index, 1);
   }

   $scope.save = function(){
      $spkService.post.createSpk($scope.spkData).then(function(response){
         var succeedUrl = "/sales/tipo/tipoinfo/" + routeParams.id;
         $rootScope.triggerModal("SPK berhasil dibuat.", "Success", "success", succeedUrl);
      })
      .catch(function(error){
         $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
   }

   $scope.addItemManually = function(){
     $scope.spkData.item.push({
        name: '',
        category: '',
        description: '',
        quantity: ''
     })
   }

});
