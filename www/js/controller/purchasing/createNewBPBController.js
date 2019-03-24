distributionApp.controller('createNewBPBController', function($scope, $purchaseService, $modalService, $rootScope, $warehouseService, $supplierService, $itemService, $moment){

    $scope.bpbData = {
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
       selectedBpbType: null
    }
 
    $scope.listPoType = [
      {name: "Kontrak", value: 1},
      {name: "Non Kontrak", value: 0}
    ];
 
    setTimeout(function(){
       $scope.init();
    },200);
 
    $scope.init = function(){
       getAllWarehouse();
       getAllSupplier();
       initBPBType();
    }
 
    function initBPBType(){
      $scope.bpbData.selectedBpbType = $scope.listPoType[0];
      $scope.bpbData.type = $scope.listPoType[0].value;
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
 
    $scope.changeBpbType = function(data){

      $scope.bpbData.type = data.value;
      $scope.bpbData.item = [];
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


   $scope.changeWarehouse = function(data){
      $scope.bpbData.warehouse_id = data.id;
   }
    $scope.changeSupplier = function(data){
      $scope.bpbData.supplier_id = data.id;
      getDetailSupplier(data.id);
   }

 
    function getAllWarehouse(){
       $warehouseService.get.warehouse().then(function(response){
          console.log(response);
          $scope.warehouseList = response.result;
          $scope.bpbData.selectedWarehouse = $scope.warehouseList[0];
          $scope.bpbData.warehouse_id = $scope.warehouseList[0].id;
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
          $scope.bpbData.selectedSupplier = $scope.supplierList[0];
          $scope.$apply();
       })
       .catch(function(error){
          console.log(error);
       })
    }
 
    function getDetailSupplier(id){
        if(id == ""){
          $scope.bpbData.supp_contact_person = "";
          $scope.bpbData.supp_address = "";
          $scope.bpbData.supp_phone = "";
          $scope.$apply();
        }
        else{
          $supplierService.get.detailSupplier(id).then(function(response){
             console.log(response);
             $scope.bpbData.supp_contact_person = response.result.contact_person;
             $scope.bpbData.supp_address = response.result.address;
             $scope.bpbData.supp_phone = response.result.phone;
             $scope.$apply();
          })
          .catch(function(error){
             console.log(error);
          })
        }
    }

    $scope.addItem = function(){
      if($scope.bpbData.type == 1){
        var modalOptions = {
             scope: $scope,
             templateUrl: '/dist/view/modal/addContractItem.html',
             size: 'lg'
          }
  
        if($scope.bpbData.supplier_id == ""){
           $rootScope.triggerModal("Supplier harus dipilih terlebih dahulu","Error","danger", "");
        }
        else{
           $scope.requiredData = {
              name: '',
              category: '',
              limit: 10,
              offset: 0,
              supplier_id: $scope.bpbData.supplier_id
           }
  
           $modalService.open(modalOptions)
              .then(function(response) {
                 console.log($scope.bpbData.supplier_id);
  
  
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
                    $scope.bpbData.item.push({
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

 });
 