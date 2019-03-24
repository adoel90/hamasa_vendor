distributionApp.controller('purchasingContractReportController', function($scope, $rootScope, $reportService, $myCookies){
  $scope.purchasingContract = null;
  var accessToken = $myCookies.get("accessToken");
  $scope.contractId = "";
  $scope.dataExists = false;

  $scope.headings = [
    {name: "No PO"},
    {name: "Tgl PO"},
    {name: "Nama Barang"},
    {name: "Jumlah"},
    {name: "Berat"},
    {name: "Tonase"},
    {name: "Harga"},
    {name: "Jumlah Harga"}
  ];

  $scope.cols = [
    {name: "poId", type: "text"},
    {name: "poDate", type: "text"},
    {name: "itemName", type: "text"},
    {name: "itemQuantity", type: "number"},
    {name: "itemWeight", type: "number"},
    {name: "itemTonase", type: "number"},
    {name: "itemPrice", type: "number"},
    {name: "itemTotal", type: "number"}
  ];

  function getPurchasingContractReport(id){
    $reportService.get.purchaseContractReport(id).then(response => {
      console.log(response);
      $scope.purchasingContract = {
        id: response.result.id,
        date: response.result.date,
        dp: $rootScope.numberWithCommas(response.result.dp),
        dp_remain: $rootScope.numberWithCommas(response.result.dp_remain),
        tonase: response.result.tonase,
        tonase_remain: response.result.tonase_remain,
        supplier: response.result.supplier,
        history: response.result.history
      };

      if($scope.purchasingContract.history){
        for(var i=0; i < $scope.purchasingContract.history.length ; i++){
          $scope.purchasingContract.history[i].poId = $scope.purchasingContract.history[i].po.id;
          $scope.purchasingContract.history[i].poDate = $scope.purchasingContract.history[i].po.date;
          $scope.purchasingContract.history[i].itemName = $scope.purchasingContract.history[i].item.name;
          $scope.purchasingContract.history[i].itemQuantity = $scope.purchasingContract.history[i].item.quantity;
          $scope.purchasingContract.history[i].itemWeight = $scope.purchasingContract.history[i].item.weight;
          $scope.purchasingContract.history[i].itemTonase = $scope.purchasingContract.history[i].item.tonase;
          $scope.purchasingContract.history[i].itemPrice = $scope.purchasingContract.history[i].item.price;
          $scope.purchasingContract.history[i].itemTotal = $scope.purchasingContract.history[i].item.total;
        }
      }
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
      $scope.dataExists = false;
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.doSearchFilter = function(id){
    getPurchasingContractReport(id);
  }

  $scope.printReport = function(){
    location.href = api.url + "purchase/contract/history/print?accessToken=" + accessToken + "&id=" + $scope.contractId;
  }
})
