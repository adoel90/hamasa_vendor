distributionApp.controller("salesAuthController", function($scope, $rootScope, $modalService, $salesService, $doService, $myCookies, $authorizationService){
  var accessToken = $myCookies.get('accessToken');

  $scope.requiredData = {
    limit: 10,
    offset: 0,
    date: ""
  }

  $scope.searchFilters = [
    {by: "date", name: "Tanggal Otorisasi", placeholder: "Masukkan tanggal otorisasi"}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  };

  $scope.headings = [
    {name: "Tanggal"},
    {name: "Nama Otorisasi"},
    {name: "Status Otorisasi"}
  ];

  $scope.cols = [
    {name: 'date', type: 'text'},
    {name: 'typeName', type: 'text'},
    {name: 'status', type: 'badge'}
  ]

  $scope.btnName = null;
  $scope.tableType = 'table-badge';

  setTimeout( () => {
    $scope.init();
  }, 150);

  $scope.defineAuthStatus = function(statusId){
    if(statusId == 0) return "-";
    else if(statusId == 1) return "Approved";
    else if(statusId == -1) return "Rejected";
  }

  $scope.init = function(){
    $salesService.get.salesAuthList($scope.requiredData).then(function(response){
      console.log(response);
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].typeName = response.result.data[i].type.name;
        response.result.data[i].statusName = $scope.defineAuthStatus(response.result.data[i].status);
      }
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(function(error){
      console.log(error);
    })
  }

  $scope.doSearchFilter = function(val, type){
    $scope.requiredData.offset = 0;
    switch(type){
      case "date":{
        $scope.requiredData.date = val;
        break;
      }
    }
    $scope.init();
  }

  $rootScope.$on('requestFetchData', function() {
   $scope.init();
  })

  $scope.$on("openDetailDataInTable", function(event, args){
    var salesTypeId = args.state.data.type.id;
    var salesAuth = args.state.data;

    if(salesTypeId == 1){
      $scope.handleSoAproval(salesAuth);
    }
    else if(salesTypeId == 2){
      $scope.handleMasterPriceAdjustment(salesAuth);
    }
    else if(salesTypeId == 3){
      $scope.handleDoReprint(salesAuth);
    }
    else if(salesTypeId == 4){
      $scope.handleSoCancelation(salesAuth);
    }
    else if(salesTypeId == 5){
      $scope.handleSalesContractCancelation(salesAuth);
    }
    else if(salesTypeId == 9){
      $scope.handleDoPrintIfInvoiceNotPaid(salesAuth);
    }
  })


  $scope.handleDoPrintIfInvoiceNotPaid = function(salesAuth){
    $scope.purpose = "do print if invoice not paid";
    $scope.soAuthStatus = salesAuth.status;
    $scope.modalName = "Permintaan Print DO untuk Invoice Belum Lunas";
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/doDetail.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.authData = {
        id: salesAuth.id
      }

      setTimeout(()=>{
        $scope.doInit();
      }, 150);

      $scope.doInit = function(){
        getDoDetail(salesAuth.do_id);
      }

      $scope.acceptDoPrintRequest = function(){
        accessApiToApproveDoReprint($scope.authData);
      }

      $scope.rejectDoPrintRequest = function(){
        accessApiToRejectAuthorization($scope.authData, "Permintaan print ulang DO untuk invoice belum dibayar telah ditolak");
      }
    })
  }

  $scope.handleMasterPriceAdjustment = function(salesAuth){
    $scope.purpose = "Approval for Master Price Adjustment";
    $scope.soAuthStatus = salesAuth.status;

    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/salesPriceAuthDetail.html',
      size: 'lg'
    }


    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.authData = {
        id: salesAuth.id
      }

      $scope.salesPriceAuth = {
        item: null,
        headings: [
          {name: "Tipe Harga"},
          {name: "Serial"},
          {name: "Kategori"},
          {name: "Nama Barang"},
          {name: "Unit"},
          {name: "Berat"},
          {name: "Grade"},
          {name: "Brand"},
          {name: "Harga Sebelum"},
          {name: "Harga Sesudah"}
        ]
      };

      setTimeout(()=>{
        $scope.initSalesPriceAuth();
      }, 150);

      $scope.initSalesPriceAuth = function(){
        $salesService.get.priceAuthDetail(salesAuth.id).then(response => {
          console.log(response);
          $scope.salesPriceAuth.item = response.result;
          $scope.$apply();
        })
        .catch(error => {
          console.log(error);
        })
      }

      $scope.approvePriceMasterUpdate = function(){
        accessApiToApprovePriceMasterUpdate($scope.authData);
      }

      $scope.rejectPriceMasterUpdate = function(){
        accessApiToRejectAuthorization($scope.authData, "Price master update telah ditolak!");
      }

    });

  }

  $scope.handleSalesContractCancelation = function(salesAuth){
    $scope.purpose = "Approval Sales Contract Cancelation";
    $scope.contractAuthStatus = salesAuth.status;
    $scope.authData = {
      id: salesAuth.id
    }
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/salesContractDetail.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.item = {
        headings: [
          { name: 'Kategori' },
          { name: 'Nama Barang' },
          { name: 'Satuan' },
          { name: 'Grade' },
          { name: 'Jumlah' },
          { name: 'Harga' },
        ]
      }
      $scope.amandement = {
        headings: [
          { name: 'Tanggal' },
          { name: 'Perubahan' }
        ]
      }

      setTimeout(()=>{
        $scope.initSalesContractCancelation();
      }, 200);

      $scope.initSalesContractCancelation = function(){
        getSalesContractDetail(salesAuth.sales_contract_id);
      }

      $scope.acceptSoContractCancelation = function(){
        accessApiToApproveSalesContractCancelation($scope.authData);
      }

      $scope.rejectSoContractCancelation = function(){
        accessApiToRejectAuthorization($scope.authData, "Pembatalan kontrak penjualan telah ditolak!");
      }
    })
  }
  $scope.handleDoReprint = function(salesAuth){
    $scope.purpose = "do reprint";
    $scope.soAuthStatus = salesAuth.status;
    $scope.modalName = "Perminattan Print Ulang DO";

    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/doDetail.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.authData = {
        id: salesAuth.id
      }

      setTimeout(()=>{ $scope.initDoDetail(); }, 70);

      $scope.initDoDetail = function(){
        getDoDetail(salesAuth.do_id);
      }

      $scope.acceptDoPrintRequest = function(){
        accessApiToApproveDoReprint($scope.authData);
      }

      $scope.rejectDoPrintRequest = function(){
        accessApiToRejectAuthorization($scope.authData, "Permintaan print ulang DO telah ditolak");
      }
    })
  }

  function mappingIntoDoDetailFields(doDetail){
    $scope.listFieldsInTheLeft = [
      { name: "Nomor DO", value: doDetail.id, type: "text" },
      { name: "Nomor EX DO", value: doDetail.ex_do, type: "text" },
      { name: "Tanggal", value: doDetail.date, type: "text" },
      { name: "Status", value: doDetail.status.name, type: "text" }
    ];

    $scope.listFieldsInTheRight = [
      { name: "ID Customer", value: doDetail.customer.id, type: "text" },
      { name: "Nama Customer", value: doDetail.customer.name, type: "text" },
      { name: "NPWP Customer", value: doDetail.customer.npwp, type: "text" },
    ];

    $scope.listFieldsInTheLeft2 = [
      { name: "Nama Gudang", value: doDetail.warehouse.name , type: "text"},
      { name: "Nomor BKB", value: doDetail.bkb ? doDetail.bkb.id : '-' , type: "text" }
    ];

    $scope.listFieldsInTheRight2 = [
      { name: "Pengemudi", value: doDetail.bkb ? doDetail.bkb.driver : '-', type: "text"},
      { name: "No Kendaraan", value: doDetail.bkb ? doDetail.bkb.transport_number : '-', type: "text" }
    ];

    $scope.$apply();
  }

  function getDoDetail(id){
    $doService.get.doDetail(id).then(response => {
      for(var i=0; i< response.result.item.length; i++){
        response.result.item[i].categoryName = response.result.item[i].category.name;
      }
      $scope.doDetail = response.result;
      $scope.doDetailCols = ["serial", "categoryName", "name", "grade", "quantity"];
      $scope.doDetailHeadings = [
        {name: "Serial"},
        {name: "Kategori"},
        {name: "Nama Barang"},
        {name: "Grade"},
        {name: "Jumlah Ambil"}
      ];
      mappingIntoDoDetailFields($scope.doDetail);
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.handleSoAproval = function(salesAuth){
    $scope.purpose = "Approval SO";

    $scope.authData = {
      id: salesAuth.id
    }
    $scope.soAuthStatus = salesAuth.status;

    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/salesOrderDetail.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {

      setTimeout( () => {
        $scope.initSoApprovalDetail();
      },50)

      $scope.initSoApprovalDetail = function(){
        getSalesOrderDetail(salesAuth.so_id);
      }

      $scope.editSoDetail = function(id){
        var soId = encodeURIComponent(id);
        $rootScope.redirectTo('/authorization/salesauth/salesorderauth/'+soId);
      }

      $scope.acceptSoDetail = function(){
        accessApiToApproveSoDetail($scope.authData);
      }
      $scope.rejectAuth = function(){
        accessApiToRejectAuthorization($scope.authData, "SO telah dibatalkan");
      }
    })

  }

  $scope.handleSoCancelation = function(salesAuth){
    $scope.purpose = "Approval SO Cancelation";
    $scope.authData = {
      id: salesAuth.id
    }
    $scope.soAuthStatus = salesAuth.status;
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/salesOrderDetail.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {

      setTimeout( () => {
        $scope.initSoDetailForCancelation();
      },50)

      $scope.initSoDetailForCancelation = function(){
        getSalesOrderDetail(salesAuth.so_id, 'so cancelation');
      }

      $scope.acceptSoCancelation = function(){
        accessApiToApproveSoDetailCancelation($scope.authData);
      }

      $scope.rejectAuth = function(){
        accessApiToRejectAuthorization($scope.authData, "Pembatalan SO telah ditolak");
      }
    })
    .catch(function(error){
      console.warn(error);
    })
  }

  function accessApiToRejectPriceMasterUpdate(data){
    $salesService.delete.rejectPriceMasterUpdate(data).then(response => {
      $rootScope.triggerModal("Otorisasi perubahan harga master barang telah ditolak", "Success", "success", "/authorization/salesauth");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function accessApiToApprovePriceMasterUpdate(data){
    $salesService.put.approvePriceMasterUpdate(data).then(response => {
      $rootScope.triggerModal("Otorisasi perubahan harga master barang telah diterima","Success", "success", "/authorization/salesauth");
    })
    .catch(error => {
      console.log(error);
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
  function accessApiToApproveSoDetail(data){
    $salesService.post.approveSoDetail(data).then(function(response){
      console.log(response);
      $rootScope.triggerModal("Sales Order telah diterima!", "Success", "success", "/authorization/salesauth");
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function accessApiToRejectAuthorization(data, successMessage){
    $authorizationService.delete.rejectAuth(data).then(function(response){
      $rootScope.triggerModal(successMessage, "Success", "success", "/authorization/salesauth");
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function accessApiToApproveSoDetailCancelation(data){
    $salesService.post.approveSoDetailCancelation(data).then(function(response){
      console.log(response);
      $rootScope.triggerModal("Sales order telah ditolak", "Success", "success", "/authorization/salesauth");
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function accessApiToApproveSalesContractCancelation(data){
    $salesService.post.approveSalesContractCancelation(data).then(function(response){
      $rootScope.triggerModal("Kontrak penjualan telah dibatalkan", "Success", "success", "/authorization/salesauth");
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function accessApiToApproveDoReprint(data){
    $doService.post.acceptReprintDo(data).then(response => {
      var directToPrintDo = api.url + "do/reprint?accessToken=" + accessToken + "&id=" + data.id;
      $rootScope.triggerModal("Permintaan Print Ulang DO telah diterima", "Success", "success", directToPrintDo);
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function getSalesOrderDetail(soId, type){
    $salesService.get.salesOrderDetail(soId).then(function(response){
      console.log(response);
      $scope.listFieldsInTheLeft = [
        {name: "Nomor SO", value: response.result.id, type: "text"},
        {name: "Tanggal SO", value: response.result.date, type: "text"},
        {name: "Status SO", value: response.result.status.name, type: "text"}
      ];

      $scope.listFieldsInTheRight = [
        {name: "ID Customer", value: response.result.customer.id, type: "text"},
        {name: "Nama Customer", value: response.result.customer.name, type: "text"},
        {name: "NPWP Customer", value: response.result.customer.npwp, type: "text"}
      ];

      $scope.salesOrderDetail = response.result;

      if(type == 'so cancelation'){
        $scope.salesOrderDetail.headings = [
          {name: "Kategori"},
          {name: "Nama Barang"},
          {name: "Satuan"},
          {name: "Grade"},
          {name: "Harga Jual"},
          {name: "Jumlah Pesan"},
          {name: "Jumlah Batal"},
          {name: "Gudang"},
          {name: "Keterangan"}
        ]
      }
      else{
        $scope.salesOrderDetail.headings = [
          {name: "Kategori"},
          {name: "Nama Barang"},
          {name: "Satuan"},
          {name: "Grade"},
          {name: "Harga Jual"},
          {name: "Jumlah"},
          {name: "Gudang"},
          {name: "Keterangan"}
        ]
      }

      $scope.$apply();
    })
    .catch(function(error){
      console.log(error);
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  function getSalesContractDetail(id){
    $salesService.get.contractDetail(id).then(function(response){
      $scope.listFieldsInTheLeft = [
        { name: "Nomor Kontrak", value: response.result.id, type: "text" },
        { name: "Tanggal Kontrak", value: response.result.date, type: "text" },
        { name: "Akhir Kontrak", value: response.result.end, type: "text" },
        { name: "DP Kontrak", value: $rootScope.numberWithCommas(response.result.dp), type: "text" }
      ];
      $scope.listFieldsInTheRight = [
        { name: "ID Customer", value: response.result.customer.id, type: "text" },
        { name: "Nama Customer", value: response.result.customer.name, type: "text" },
        { name: "NPWP Customer", value: response.result.customer.npwp, type: "text" },
        { name: "Tonase", value: $rootScope.numberWithCommas(response.result.customer.tonase), type: "text" }
      ];
      for(var i=0; i < response.result.item.length; i++){
        response.result.item[i].categoryName = response.result.item[i].category.name;
      }
      $scope.contractDetailCols = [
        {name: "categoryName", type: "text"},
        {name: "name", type: "text"},
        {name: "unit", type: "text"},
        {name: "grade", type: "text"},
        {name: "quantity", type: "number"},
        {name: "price", type: "number"}
      ];
      $scope.amandemenCol = ["date", "detail"];
      $scope.salesContractDetail = response.result;
      $scope.$apply();
    })
    .catch(function(error){
      console.log(error);
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
})
