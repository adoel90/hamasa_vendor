distributionApp.controller('createNewPoController', function($scope, $purchaseService, $modalService, $rootScope, $warehouseService, $supplierService, $itemService, $moment){

   $scope.poData = {
      date: $moment(new Date()).format('YYYY-MM-DD'),
      type: null,
      supplier_id: '',
      supp_address: '',
      supp_contact_person: '',
      supp_phone: '',
      so_id: '',
      warehouse_id: '',
      item: [],
      selectedWarehouse: null,
      selectedSupplier: null,
      selectedPoType: null
   }

   $scope.listPoType = [
   //   {name: "Kontrak", value: 1},
     {name: "Non Kontrak", value: 0}
   ];

   setTimeout(function(){
      $scope.init();
   },200);

   $scope.init = function(){
      getAllWarehouse();
      getAllSupplier();
      initPoType();
   }

   function initPoType(){
     $scope.poData.selectedPoType = $scope.listPoType[0];
     $scope.poData.type = $scope.listPoType[0].value;
     $scope.headings = [
        {name: "Serial"},
        {name: "Kategori"},
        {name: "Nama Barang"},
        {name: "Satuan"},
        {name: "Grade"},
        {name: "Jumlah"},
        {name: "Action"}
     ];
   }

   $scope.changePoType = function(data){
     $scope.poData.type = data.value;
     $scope.poData.item = [];
     if(data.value == 1){
       $scope.headings = [
          {name: "Serial"},
          {name: "Kategori"},
          {name: "Nama Barang"},
          {name: "Satuan"},
          {name: "Grade"},
          {name: "Jumlah"},
          {name: "Action"}
       ];
     }
     else{
       $scope.headings = [
          {name: "Serial"},
          {name: "Kategori"},
          {name: "Nama Barang"},
          {name: "Satuan"},
          {name: "Grade"},
          {name: "Jumlah"},
          {name: "Harga"},
          {name: "Action"}
       ];
     }
   }

   function getAllWarehouse(){
      $warehouseService.get.warehouse().then(function(response){
         console.log(response);
         $scope.warehouseList = response.result;
         $scope.poData.selectedWarehouse = $scope.warehouseList[0];
         $scope.poData.warehouse_id = $scope.warehouseList[0].id;
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   function getAllSupplier(){
      $supplierService.get.allSuppliers().then(function(response){
         $scope.supplierList = response.result;
         $scope.supplierList.splice(0,0,{id: "", name: "-- Pilih Supplier --"});
         $scope.poData.selectedSupplier = $scope.supplierList[0];
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   function getDetailSupplier(id){
       if(id == ""){
         $scope.poData.supp_contact_person = "";
         $scope.poData.supp_address = "";
         $scope.poData.supp_phone = "";
         $scope.$apply();
       }
       else{
         $supplierService.get.detailSupplier(id).then(function(response){
            console.log(response);
            $scope.poData.supp_contact_person = response.result.contact_person;
            $scope.poData.supp_address = response.result.address;
            $scope.poData.supp_phone = response.result.phone;
            $scope.$apply();
         })
         .catch(function(error){
            console.log(error);
         })
       }
   }

   $scope.changeWarehouse = function(data){
      $scope.poData.warehouse_id = data.id;
   }
   $scope.changeSupplier = function(data){
      $scope.poData.supplier_id = data.id;
      getDetailSupplier(data.id);
   }

   $scope.addItem = function(){
    if($scope.poData.type == 1){
      var modalOptions = {
  			scope: $scope,
  			templateUrl: '/dist/view/modal/addContractItem.html',
  			size: 'lg'
  		}

      if($scope.poData.supplier_id == ""){
         $rootScope.triggerModal("Supplier harus dipilih terlebih dahulu","Error","danger", "");
      }
      else{
         $scope.requiredData = {
            name: '',
            category: '',
            limit: 10,
            offset: 0,
            supplier_id: $scope.poData.supplier_id
         }

         $modalService.open(modalOptions)
   			.then(function(response) {
               console.log($scope.poData.supplier_id);


               $scope.searchFilters = [
                  {by: "name", name: "Nama Barang", placeholder: "Masukkan Nama Barang"},
                  {by: "category", name: "Kategori Barang", placeholder: "Masukkan Kategori Barang"}
               ];

               $scope.selectedFilter = {
                  item: $scope.searchFilters[0]
               }

               $scope.warehouseItem = {
                  items: [],
                  headings: [
                     {name: "Serial"},
                     {name: "Kategori"},
                     {name: "Nama"},
                     {name: "Unit"},
                     {name: "Grade"},
                     {name: "Harga"},
                     {name: "Contract"}
                  ]
               }
               setTimeout(function(){
                  $scope.init();
               },200);

               $scope.doSearchFilter = function(val, type){

                  switch(type){
                     case "name":{
                        $scope.requiredData.name = val;
                        $scope.requiredData.category = "";
                        break;

                     }
                     case "category":{
                        $scope.requiredData.category = val;
                        $scope.requiredData.name = "";
                        break;
                     }
                  }
                  $scope.init();
               }

               $scope.init = function(){
                  getContractItem($scope.requiredData);
               }
               $scope.$on("requestFetchData", function(){
                 getContractItem($scope.requiredData);
               })
               function getContractItem(data){
                  $purchaseService.contract.get.purchaseContractItem(data).then(function(response){
                     console.log(response);
                     $scope.warehouseItem.items = response.result.data;
                     $scope.totalRows = response.result.row;
                     $scope.$apply();
                  })
                  .catch(function(error){
                     console.log(error);
                  })
               }

               $scope.chooseItem = function(item){
                  $scope.poData.item.push({
                     ig_id: item.ig_id,
                     price: item.price,
                     quantity: '',
                     contract_id: item.contract_id,
                     category: item.category.name,
                     name: item.name,
                     unit: item.unit,
                     grade: item.grade
                  })
                  $modalService.close();
               }

            })
            .catch(function(error){
               console.log(error);
            })
      }
    }

   }

   $scope.$on("chooseItemInMasterList", function(event, args){
     var item = args.state.item;
     $scope.poData.item.push({
        ig_id: item.ig_id,
        quantity: '',
        contract_id: '',
        price: '',
        category: item.category.name,
        name: item.name,
        unit: item.unit,
        grade: item.grade
     })
   })

   $scope.save = function(){
    var validationSucceed = true;
    for(var i=0; i<$scope.poData.item.length; i++){
      if($scope.poData.item[i].quantity){
        var qty = $scope.poData.item[i].quantity.replace(/,/g, '');
        if(isNaN(qty)){
          validationSucceed = false;
          break;
        }
      }
    }

    setTimeout( () => {
      if(validationSucceed){
        if($scope.poData.type == 0){
          for(var i=0; i<$scope.poData.item.length; i++){
            $scope.poData.item[i].quantity = $rootScope.numberWithNoCommas($scope.poData.item[i].quantity);
            $scope.poData.item[i].price = $rootScope.numberWithNoCommas($scope.poData.item[i].price);
          }
        }
        else{
          for(var i=0; i<$scope.poData.item.length; i++){
            $scope.poData.item[i].quantity = $rootScope.numberWithNoCommas($scope.poData.item[i].quantity);
          }
        }

        setTimeout(() => { createNewPo($scope.poData); }, 250);

      }
      else{
        $rootScope.triggerModal("Quantity yang diinput harus numerik","Error","danger", "");
      }
    },300);
   }

   $scope.deletePoItem = function(index){
      $scope.poData.item.splice(index,1);
      $scope.$apply();
   }
   function createNewPo(data){
      $purchaseService.order.post.createNewPo(data).then(function(response){
         $rootScope.triggerModal("PO berhasil dibuat", "Success", "success", "/purchasing/po");
      })
      .catch(function(error){
         $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
   }
});
