distributionApp.controller("salesOrderAuthController", function($scope, $rootScope, $modalService, $salesService){
  $rootScope.salesId = encodeURIComponent(routeParams.id);
  setTimeout(()=>{
    $scope.init();
  }, 150);

  $scope.init = function(){
    getSoDetailById(routeParams.id);
  }
  function getSoDetailById(id){
    $salesService.get.salesOrderDetail(id).then(response => {
      console.log(response);
      $scope.salesOrderDetail = response.result;
      for(var i=0; i<$scope.salesOrderDetail.item.length; i++){
        $scope.salesOrderDetail.item[i].price = $rootScope.numberWithCommas($scope.salesOrderDetail.item[i].price);
        $scope.salesOrderDetail.item[i].sell_price = $rootScope.numberWithCommas($scope.salesOrderDetail.item[i].sell_price);
      }
      $scope.salesOrderDetail.headings = [
        {name: "Kategori"},
        {name: "Nama Barang"},
        {name: "Satuan"},
        {name: "Grade"},
        {name: "Harga Dasar"},
        {name: "Harga Jual"},
        {name: "Jumlah"},
        {name: "Gudang"},
        {name: "Keterangan"}
      ]
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $scope.save = function(){
    var validationNotSucceed = false;
    setTimeout(()=>{
      for(var i=0; i<$scope.salesOrderDetail.item.length; i++){  
        $scope.salesOrderDetail.item[i].sell_price = $rootScope.numberWithNoCommas($scope.salesOrderDetail.item[i].sell_price);
        $scope.salesOrderDetail.item[i].price = $rootScope.numberWithNoCommas($scope.salesOrderDetail.item[i].price);      
      }
    },250);

    setTimeout(()=>{ updateSoDetail($scope.salesOrderDetail); }, 350);
  }

  function updateSoDetail(data){
    $salesService.put.updateSoByAuthorization(data).then(function(response){
      $rootScope.triggerModal("So berhasil diupdate!", "Success", "success", "/authorization/salesauth");
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    });
  }
});
