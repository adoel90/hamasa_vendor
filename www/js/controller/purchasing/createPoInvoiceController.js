distributionApp.controller('createPoInvoiceController', function($scope, $rootScope, $purchaseService, $modalService, $moment, $supplierService){
  $scope.poInvoice = {
    id: '',
    date: $moment(new Date()).format('YYYY-MM-DD'),
    po: '',
    item: [],
    due_date: '',
    tax_invoice: '',
    supplier: null,
    selectedSupplier: null
  }

  $scope.doCalculate = function(item){
    if(item.weight){
      item.price = $rootScope.numberWithCommas($rootScope.numberWithNoCommas(item.weight) * $rootScope.numberWithNoCommas(item.priceKg));
    }
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

      // for(var i=0; i < response.result.data.length; i++){
      //   var data = response.result.data[i];
      //   $scope.listPoItem.push({
      //     ig_id: data.ig_id,
      //     serial: data.serial,
      //     name: data.name,
      //     category: data.category.name,
      //     quantity: data.quantity,
      //     weight: data.weight,
      //     priceKg: data.weight ? $rootScope.numberWithCommas($rootScope.roundToTwoDecimalPlaces(parseInt(data.price) / parseInt(data.weight))) : '-',
      //     price: $rootScope.numberWithCommas(data.price),
      //     po_id: data.po_id,
      //     check: false
      //   })
      // }
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  setTimeout(() => { $scope.init(); }, 100);

  $scope.init = function(){
     getAllSupplier();
  }

  function getAllSupplier(){
     $supplierService.get.allSuppliers().then(function(response){
        $scope.supplierList = response.result;
        $scope.supplierList.splice(0,0,{id: "", name: "-- Pilih Supplier --"});
        $scope.poInvoice.selectedSupplier = $scope.supplierList[0];
        $scope.$apply();
     })
     .catch(function(error){
        console.log(error);
     })
  }

  $scope.changeSupplier = function(data){
     $scope.poInvoice.supplier = data.id;
  }

  $scope.viewPoItem = function(){
    if($scope.poInvoice.supplier){
      $scope.modalName = "List Item";
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

        $scope.$on("requestFetchData", function(event, args){
          getPoInvoiceItem($scope.requiredData);
        })
        $scope.doSearchFilter = function(val, type){
          $scope.requiredData.offset = 0;
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

  $scope.showHistory = function(poId){
    $purchaseService.order.get.purchaseOrderBtbHistory(poId).then(response => {
      console.log(response);
      if(response.result.length > 0){
        var modalOptions = {
          scope: $scope,
          templateUrl: '/dist/view/modal/btbHistory.html',
          size: 'lg'
        }

        $modalService.open(modalOptions).then(response => {
          $purchaseService.order.get.purchaseOrderBtbHistory(poId).then(response => {
            $scope.btbHistoryList = response.result;
            $scope.btbHistoryHeadings = [
              {name: "Serial"},
              {name: "Kategori"},
              {name: "Nama"},
              {name: "Unit"},
              {name: "Berat"},
              {name: "Quantity"}
            ];
            $scope.$apply();
          })

        })
      }
      else{
        $rootScope.triggerModal("Belum ada histori BTB untuk PO ini", "Error", "danger", "");
      }
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
  $scope.$on("openDetailDataInTable", function(event, args){
    $scope.searchFilters = null;
    $scope.itemHeadings = [
      {name: "ID PO", width: "5%"},
      {name: "Serial", width: "10%"},
      {name: "Kategori", width: "15%"},
      {name: "Nama", width: "20%"},
      {name: "Qty", width: "10%"},
      {name: "Berat", width: "8%"},
      {name: "Harga / kg", width: "10%"},
      {name: "Harga / unit", width: "10%"},
      {name: "Action", width: "auto"}
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

  $scope.savePoInvoice = function(){
    for(var i=0; i<$scope.poInvoice.item.length; i++){
      $scope.poInvoice.item[i].quantity = $rootScope.numberWithNoCommas($scope.poInvoice.item[i].quantity);
      $scope.poInvoice.item[i].price = $rootScope.numberWithNoCommas($scope.poInvoice.item[i].price);
    }
    setTimeout(() => {
      createPoInvoice($scope.poInvoice);
    }, 200);
  }

  function createPoInvoice(data){
    $purchaseService.order.post.createPoInvoice(data).then(response => {
      console.log(response);
      $rootScope.triggerModal("Po Invoice berhasil dibuat", "Success", "success", "/purchasing/poinvoice");
    })
    .catch(error => {
      console.log(error);
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

});
