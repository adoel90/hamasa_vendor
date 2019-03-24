distributionApp.controller('purchasingContractController', function($scope, $timeout, $purchaseService, $rootScope, $modalService, $myCookies){
  var accessToken = $myCookies.get("accessToken");

  console.log("Purchasing Contract COntroller");

  $scope.requiredData = {
      limit: 10,
      offset: 0,
      id: '',
      date: '',
      supplier: '',
      s_date: '',
      e_date: ''
   }

   $scope.searchFilters = [
      {by: 'id', name: 'ID Kontrak Pembelian', placeholder: 'Masukkan ID Kontrak Pembelian'},
      {by: 'date', name: 'Tanggal Kontrak Pembelian', placeholder: 'Masukkan Tanggal Kontrak Pembelian'},
      {by: 'supplier', name: 'Supplier', placeholder: 'Masukkan Nama Supplier'},
      {by: 'range_date', name: 'Range Tanggal'}
   ];

   $scope.selectedFilter = {
      item: $scope.searchFilters[0]
   }

   $scope.headings = [
      {name:'Tanggal Kontrak'},
      {name:'Nomor Kontrak', size: 'lg'},
      {name:'Supplier'},
      {name:'Tonase', size: 'lg'},
      {name: 'Sisa'},
      {name: 'Action'}
   ];

   $scope.btnName = "Buat Kontrak Pembelian";

   setTimeout(function(){ $scope.init(); }, 150);

   $scope.init = function(){
    getPurchasingContractList($scope.requiredData);
   }

   $scope.redirectToCreateNewData = function(){
     location.href = "/purchasing/purchasingcontract/createnewpurchasingcontract";
   }
   function getPurchasingContractList(data){
    $purchaseService.contract.get.purchasingContractList(data).then(function(response){
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].tonase_remain = $rootScope.roundToTwoDecimalPlaces(response.result.data[i].tonase_remain);
      }

      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
   }

   $scope.exportToExcel = function(){
     location.href = api.url + "report/original/purchase/contract?accessToken=" + accessToken + '&id='+ $scope.requiredData.id + '&date=' + $scope.requiredData.date + '&supplier_name=' + $scope.requiredData.supplier + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date + "&export=" + true;
   }

   $scope.doSearchFilter = function(val, type) {
     $scope.requiredData.offset = 0;
      switch(type){
         case "id": {
            $scope.requiredData.id = val;
            $scope.requiredData.date = "";
            $scope.requiredData.supplier = "";
            $scope.requiredData.s_date = "";
            $scope.requiredData.e_date = "";
            break;
         }
         case "date":{
            $scope.requiredData.id = "";
            $scope.requiredData.date = val;
            $scope.requiredData.supplier = "";
            $scope.requiredData.s_date = "";
            $scope.requiredData.e_date = "";
            break;
         }
         case "supplier":{
            $scope.requiredData.id = "";
            $scope.requiredData.date = "";
            $scope.requiredData.supplier = val;
            $scope.requiredData.s_date = "";
            $scope.requiredData.e_date = "";
            break;
         }
      }
      setTimeout(function(){ $scope.init(); },150);
   }

   $rootScope.$on('requestFetchData', function() {
		$scope.init();
	 })

  $scope.openDetailData = function(data){
    var contractId = data.id;
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/detailPurchasingContract.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.purchasingContractDetail = {
        requiredData: {
          limit: 10,
          offset: 0,
          id: contractId
        },
        headings: [
          {name: "Serial"},
          {name: "Kategori Barang"},
          {name: "Nama Barang"},
          {name: "Berat"},
          {name: "Harga / kg"},
          {name: "Harga / unit"},
          {name: "Quantity"}
        ],
        amandementHeadings: [
          {name: "Tanggal"},
          {name: "Perubahan"}
        ],
        data:{}
      }
      $scope.initPurchasingContractDetail = function(){
        $purchaseService.contract.get.purchasingContractDetail($scope.purchasingContractDetail.requiredData).then(function(response){

          $scope.purchasingContractDetail.data = {
            id: response.result.id,
            date: response.result.date,
            end_date: response.result.end_date,
            tonase: $rootScope.numberWithCommas(response.result.tonase),
            tonase_remain: $rootScope.numberWithCommas($rootScope.roundToTwoDecimalPlaces(response.result.tonase_remain) ),
            items: response.result.item
          }
          if(response.result.amandemen){
            $scope.purchasingContractDetail.amandementData = response.result.amandemen.data;
            $scope.totalRowsInModal = response.result.amandemen.row;
          }

          $scope.$apply();
        })
        .catch(function(error){
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }

      setTimeout( () => { $scope.initPurchasingContractDetail(); }, 150)

      $rootScope.$on('requestFetchDataForModal', function() {
        $scope.initPurchasingContractDetail();
      })
    })
   }

  $scope.openDetailPurchasingHistory = function(contractId){
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/purchasingContractHistory.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.detailPurchasingHistory = {
        headings: [
          {name: "No PO"},
          {name: "Tgl PO"},
          {name: "Kode Barang"},
          {name: "Nama Barang"},
          {name: "Jumlah"},
          {name: "Berat"},
          {name: "Tonase"},
          {name: "Harga"},
          {name: "Jumlah Barang"}
        ],
        data: {}
      }

      $purchaseService.contract.get.purchasingContractHistory(contractId).then(function(response){
        $scope.detailPurchasingHistory.data = {
          id: response.result.id,
          date: response.result.date,
          dp: $rootScope.numberWithCommas(response.result.dp),
          dp_remain: $rootScope.numberWithCommas(response.result.dp_remain),
          history: response.result.history,
          supplier: response.result.supplier,
          tonase: $rootScope.numberWithCommas(response.result.tonase),
          tonase_remain: $rootScope.numberWithCommas(response.result.tonase_remain)
        }
        $scope.$apply();
      })
      .catch(function(error){
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })

    })
  }

  $scope.goToAmandemenContract = function(contractId){
    var amandemenUrl = '/purchasing/purchasingcontract/amandemenpurchasingcontract/' + encodeURIComponent(contractId);
    $rootScope.redirectTo(amandemenUrl);
  }
});
