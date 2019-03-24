distributionApp.controller('itemHistoryController', function($scope, $rootScope, $itemService) {

  $scope.headings = [
    {name: "Jenis"},
    {name: "Tanggal"},
    {name: "Dokumen ID"},
    {name: "Stock Plan"},
    {name: "Stok Aktual"}
  ]

  $itemService.get.itemHistory(routeParams.id).then(response => {
    console.log(response);
    $scope.itemHistoryList = response.result;
    $scope.$apply();
  })
  .catch(error => {
    console.log(error);
    $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
  })
});
