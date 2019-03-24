distributionApp.controller('createNewPurchasingContractController', function($scope, $supplierService, $modalService, $itemService, $purchaseService, $window, $rootScope){
   $scope.purchasingContract = {
      id: '',
      end: '',
      date: '',
      dp: '',
      tonase: '',
      supplier_id: '',
      selectedSupplier: null,
      item: []
   }

   $scope.contractEndDate = "";

   $scope.supplierDetail = {
      address: '',
      contact_number: '',
      contact_person: ''
   }

   $supplierService.get.allSuppliers().then(function(response){
     console.log(response);
      $scope.supplierList = response.result;
      $scope.supplierList.splice(0,0, {id: "", name: "-- Pilih Supplier --"});
      $scope.purchasingContract.selectedSupplier = $scope.supplierList[0];
      $scope.$apply();
   })

   $scope.headings = [
     {name: 'Serial'},
     {name: 'Kategori'},
     {name: 'Nama Barang'},
     {name: 'Berat(kg)'},
     {name: 'Jumlah'},
     {name: 'Total(kg)'},
     {name: 'Harga / kg', size: 'lg'},
     {name: 'Harga / unit', size: 'lg'},
     {name: 'Action', size: 'lg'}
   ];

   $scope.deleteContractItem = function(index){
      $scope.purchasingContract.item.splice(index, 1);
   }

   $scope.doCalculate = function(contractItem){
    contractItem.price = $rootScope.roundToTwoDecimalPlaces($rootScope.numberWithNoCommas(contractItem.weight) * $rootScope.numberWithNoCommas(contractItem.priceKg));
 		contractItem.weight = $rootScope.numberWithCommas(contractItem.weight);
 		contractItem.priceKg = $rootScope.numberWithCommas(contractItem.priceKg);
 		contractItem.price = $rootScope.numberWithCommas(contractItem.price);
   }

   $scope.chooseSupplier = function(data){
     console.log(data);
      if(data.id == ""){
        $scope.supplierDetail = {
           address: '',
           contact_number: '',
           contact_person: ''
        }
        $scope.purchasingContract.supplier_id = data.id;
        console.log(data);
        $scope.$apply();
      }
      else{
        $supplierService.get.detailSupplier(data.id).then(function(response){
           $scope.supplierDetail = {
              address: response.result.address,
              contact_number: response.result.phone,
              contact_person: response.result.contact_person
           }
           $scope.purchasingContract.supplier_id = data.id;
           console.log(data.id);
           $scope.$apply();
        })
        .catch(function(error){
           console.log(error);
        })
      }
   }
   $scope.$on("chooseItemInMasterList", function(event, args){
     var item = args.state.item;
     console.log(item);
     $scope.purchasingContract.item.push({
        serial: item.serial,
        ig_id: item.ig_id,
        price: '',
        quantity: '',
        category: item.category.name,
        name: item.name,
        unit: item.unit,
        grade: item.grade,
        weight: item.weight,
        priceKg: 0
     })
   })

   $scope.save = function(){
      var totalItemWeight = 0;
      setTimeout( () => {
        for(var i=0; i<$scope.purchasingContract.item.length; i++){

          if(isNaN( $rootScope.numberWithNoCommas($scope.purchasingContract.item[i].price)) || isNaN( $rootScope.numberWithNoCommas($scope.purchasingContract.item[i].quantity))){
            $rootScope.triggerModal("Harga dan qty harus numerik", "Error", "danger", "");
            return;
          }
          else{
            totalItemWeight += ($scope.purchasingContract.item[i].weight * parseInt( $rootScope.numberWithNoCommas($scope.purchasingContract.item[i].quantity)));
          }
        }
      }, 300);

      setTimeout( () => {

        if($scope.purchasingContract.supplier_id == ""){
          $rootScope.triggerModal("Supplier harus diisi", "Error", "danger", "");
        }
        else{
          if(parseInt($rootScope.numberWithNoCommas($scope.purchasingContract.tonase)) < totalItemWeight){
            $rootScope.triggerModal("Tonase harus lebih besar dari total tonase item", "Error", "danger", "");
          }
          else{
            $scope.purchasingContract.dp = parseInt($rootScope.numberWithNoCommas($scope.purchasingContract.dp) );
            $scope.purchasingContract.tonase = parseInt($rootScope.numberWithNoCommas($scope.purchasingContract.tonase) );
            for(var i=0; i<$scope.purchasingContract.item.length; i++){
              $scope.purchasingContract.item[i].price = parseInt($rootScope.numberWithNoCommas($scope.purchasingContract.item[i].price) );
              $scope.purchasingContract.item[i].quantity = parseInt($rootScope.numberWithNoCommas($scope.purchasingContract.item[i].quantity));
            }

            setTimeout(() => {
              createNewPurchasingContract($scope.purchasingContract);
            },300);

          }
        }

      }, 600);
   }

   function createNewPurchasingContract(data){
     console.log(data);
      $purchaseService.contract.post.createNewPurchasingContract(data)
      .then(function(response){
         $rootScope.triggerModal("Kontrak pembelian berhasil dibuat", "Success", "success", "/purchasing/purchasingcontract");
         console.log(response);
      })
      .catch(function(error){
         console.log(error);
         $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
   }

});
