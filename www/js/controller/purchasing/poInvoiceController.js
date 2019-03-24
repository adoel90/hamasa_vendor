distributionApp.controller('poInvoiceController', function($scope, $rootScope, $purchaseService, $modalService, $myCookies){
  var accessToken = $myCookies.get("accessToken");
  
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    id: '',
    supplier_name: '',
    s_date: '',
    e_date: ''
  }

  setTimeout(() => {
    $scope.init();
  }, 150);

  $scope.headings = [
    {name: "No Invoice"},
    {name: "Tanggal Invoice"},
    {name: "Status"},
    {name: "Total"},
    {name: "Action"}
  ];

  $scope.init = function(){
    $purchaseService.order.get.purchaseInvoiceList($scope.requiredData).then(response => {
      console.log(response);
      $scope.poInvoiceList = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.exportToExcel = function(){
    location.href = api.url + "report/original/purchase/order/invoice?accessToken=" + accessToken + '&id=' + $scope.requiredData.id + '&supplier_name=' + $scope.requiredData.supplier_name + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date + "&export=" + true;
  }

  $scope.openPoInvoiceDetail = function(poInvoiceId){
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/poInvoiceDetail.html',
      size: 'lg'
    }

    $modalService.open(modalOptions).then(response => {
      $purchaseService.order.get.purchaseInvoiceDetail(poInvoiceId).then(response => {
        console.log(response);
        $scope.listFieldsInTheLeft = [
          {name: "No Invoice", value: response.result.id, type: "text"},
          {name: "Tanggal Invoice", value: response.result.date, type: "text"},
          {name: "Tanggal Jatuh Tempo", value: response.result.due_date, type: "text"},
          {name: "No Seri Pajak", value: response.result.tax_serial, type: "text"}
        ];
        $scope.listFieldsInTheRight = [
          {name: "Nama Supplier", value: response.result.supplier.name, type: "text"},
          {name: "NPWP Supplier", value: response.result.supplier.npwp, type: "text"},
          {name: "Alamat Supplier", value: response.result.supplier.address, type: "text"}
        ];
        $scope.poInvoiceDetail = {
          headings: [
            {name: "ID PO"},
            {name: "Serial"},
            {name: "Kategori Barang"},
            {name: "Nama Barang"},
            {name: "Quantity"},
            {name: "Harga"}
          ],
          column: [
            {name: "po_id", type: "text"},
            {name: "serial", type: "text"},
            {name: "categoryName", type: "text"},
            {name: "name", type: "text"},
            {name: "quantity", type: "number"},
            {name: "price", type: "number"}
          ],
          item: response.result.item
        }
        for(var i=0; i < $scope.poInvoiceDetail.item.length; i++){
          $scope.poInvoiceDetail.item[i].categoryName = $scope.poInvoiceDetail.item[i].category.name;
        }
        $scope.$apply();

      })
      .catch(error => {
        console.log(error);
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    })


  }

  $scope.searchFilters = [
    {by: 'id', name: 'ID Invoice', placeholder: 'Masukkan ID Invoice'},
    {by: 'supplier', name: 'Nama Supplier', placeholder: 'Masukkan Nama Supplier'},
    {by: 'range_date', name: 'Range Tanggal'}
  ]

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.redirectToEditInvoice = function(invoiceId){
    location.href = "/purchasing/poinvoice/editpoinvoice/" + encodeURIComponent(invoiceId);
  }
  $scope.doSearchFilter = function(val, type){
    switch(type){
      case "id":{
        $scope.requiredData.id = val;
        $scope.requiredData.supplier_name = "";
        $scope.requiredData.s_date = "";
        $scope.requiredData.e_date = "";
        break;
      }
      case "supplier":{
        $scope.requiredData.id = "";
        $scope.requiredData.supplier_name = val;
        $scope.requiredData.s_date = "";
        $scope.requiredData.e_date = "";
        break;
      }
    }
    $scope.init();
  }

  $rootScope.$on('requestFetchData', function() {
   $scope.init();
 })

});
