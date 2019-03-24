distributionApp.controller('editPoInvoiceController', function($scope, $rootScope, $purchaseService, $modalService, $supplierService){
  $scope.poInvoice = null;
  $scope.itemHeadings = [
    {name: "ID PO"},
    {name: "Serial"},
    {name: "Kategori"},
    {name: "Nama"},
    {name: "Qty"},
    {name: "Berat"},
    {name: "Harga / kg"},
    {name: "Harga / unit"},
    {name: "Action"}
  ]

  $rootScope.poInvoiceId = encodeURIComponent(routeParams.id);
  setTimeout(() => {
    $scope.init();
  }, 150);

  $scope.init = function(){
    getPurchaseInvoiceDetailById(routeParams.id);
  }

  function getPoInvoiceItem(data){
    $purchaseService.order.get.poInvoiceItem(data).then(response => {
      console.log(response);
      for(var i=0; i < response.result.data.length; i++){
        var data = response.result.data[i];
        data.categoryName = data.category.name;
      }
      $scope.listModalData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $scope.viewPoItem = function(){
    if($scope.poInvoice.supplier){
      var modalOptions = {
        scope: $scope,
        templateUrl: '/dist/view/modal/supplierList.html',
        size: 'lg'
      }

      $modalService.open(modalOptions).then(response => {
        $scope.requiredData = {
          limit: 10,
          offset: 0,
          supplierId: $scope.poInvoice.supplier,
          name: '',
          category: ''
        }
        $scope.searchFilters = [
          {by: "name", name: "Nama Barang", placeholder: "Masukkan nama barang"},
          {by: "category", name: "Kategori Barang", placeholder: "Masukkan kategori barang"}
        ]

        $scope.selectedFilter = {
          item: $scope.searchFilters[0]
        }

        $scope.modalHeadings = [
          {name: "Serial"},
          {name: "Kategori"},
          {name: "Nama"},
          {name: "Qty"},
          {name: "Berat"},
          {name: "Harga / unit"},
          {name: "ID PO"}
        ];
        $scope.doSearchFilter = function(val, type){
          switch(type){
            case "name":{
              $scope.requiredData.name = val;
              $scope.requiredData.category = "";
              break;
            }
            case "category":{
              $scope.requiredData.name = "";
              $scope.requiredData.category = val;
              break;
            }
          }
          getPoInvoiceItem($scope.requiredData);
        }

        $scope.modalCols = ['serial', 'categoryName', 'name', 'quantity', 'weight', 'price', 'po_id'];
        $scope.modalTableType = 'non-edited-table';
        setTimeout(() => { getPoInvoiceItem($scope.requiredData); }, 100);

      })
    }
    else{
      $rootScope.triggerModal("Supplier harus dipilih terlebih dahulu", "Error", "danger", "");
    }
  }

  $scope.deleteItem = function(index){
    $scope.poInvoice.item.splice(index, 1);
  }
  
  $scope.$on("openDetailDataInTable", function(event, args){
    $scope.searchFilters = null;
    $scope.itemHeadings = [
      {name: "ID PO"},
      {name: "Serial"},
      {name: "Kategori"},
      {name: "Nama"},
      {name: "Qty"},
      {name: "Berat"},
      {name: "Harga / kg"},
      {name: "Harga / unit"},
      {name: "Action"}
    ];
    var poItem = args.state.data;
    $scope.poInvoice.item.push({
      po_id: poItem.po_id,
      ig_id: poItem.ig_id,
      serial: poItem.serial,
      name: poItem.name,
      categoryName: poItem.categoryName,
      quantity: poItem.quantity,
      weight: poItem.weight,
      priceKg: poItem.weight ? $rootScope.numberWithCommas($rootScope.roundToTwoDecimalPlaces(parseInt(poItem.price) / parseInt(poItem.weight))) : null,
      price: $rootScope.numberWithCommas(poItem.price)
    })
    $modalService.close();
  })

  function getAllSupplier(){
     $supplierService.get.allSuppliers().then(function(response){
        $scope.supplierList = response.result;
        $scope.supplierList.splice(0,0,{id: "", name: "-- Pilih Supplier --"});
        for(var i=0; i < $scope.supplierList.length; i++){
          if($scope.supplierList[i].id == $scope.poInvoice.supplier){
            $scope.poInvoice.selectedSupplier = $scope.supplierList[i];
            break;
          }
        }
        $scope.$apply();
     })
     .catch(function(error){
        console.log(error);
     })
  }

  function getPurchaseInvoiceDetailById(id){
    console.log(id);
    $purchaseService.order.get.purchaseInvoiceDetail(id).then(response => {
      console.log(response);
      $scope.poInvoice = {
        id: response.result.id,
        date: response.result.date,
        due_date: response.result.due_date,
        tax_invoice: response.result.tax_serial,
        item: [],
        supplier: response.result.supplier.id,
        selectedSupplier: null
      }
      getAllSupplier();
      setTimeout(() => {
        for(var i=0; i < response.result.item.length; i++){
          var item = response.result.item[i];
          $scope.poInvoice.item.push({
            ig_id: item.ig_id,
            po_id: item.po_id,
            serial: item.serial,
            categoryName: item.category.name,
            name: item.name,
            quantity: item.quantity,
            weight: item.weight,
            priceKg: item.weight ? $rootScope.numberWithCommas($rootScope.roundToTwoDecimalPlaces(parseInt(item.price) / parseInt(item.weight))) : null,
            price: $rootScope.numberWithCommas(item.price)
          })
        }
        $scope.$apply();
      }, 300);
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.doCalculate = function(item){
    if(item.weight){
      item.price = $rootScope.numberWithCommas($rootScope.numberWithNoCommas(item.weight) * $rootScope.numberWithNoCommas(item.priceKg));
    }
  }

  $scope.savePoInvoice = function(){
    for(var i=0; i<$scope.poInvoice.item.length; i++){
      $scope.poInvoice.item[i].quantity = $rootScope.numberWithNoCommas($scope.poInvoice.item[i].quantity);
      $scope.poInvoice.item[i].price = $rootScope.numberWithNoCommas($scope.poInvoice.item[i].price);
    }
    setTimeout(() => {
      updatePoInvoice($scope.poInvoice);
    }, 200);
  }

  function updatePoInvoice(data){
    $purchaseService.order.put.updatePoInvoice(data).then(response => {
      console.log(response);
      $rootScope.triggerModal("Po Invoice berhasil diupdate!", "Success", "success", "/purchasing/poinvoice");
    })
    .catch(error => {
      console.log(error);
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
})
