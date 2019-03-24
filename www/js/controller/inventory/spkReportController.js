distributionApp.controller('spkReportController', function($scope, $rootScope, $spkService){

  $rootScope.spkId = encodeURIComponent(routeParams.id);
  $scope.requiredData = {
    spk_id: routeParams.id,
    item: [],
    nextItem: []
  }

  $scope.tableHeadings = [
    {name: "Nama Barang"},
    {name: "Kategori"},
    {name: "Quantity"},
    {name: "Action"}
  ];

  $scope.tableCols = [
    {name: 'name', disabled: true},
    {name: 'category', disabled: true},
    {name: 'quantity', disabled: false}
  ];

  $scope.tableColsNextItem = [
    {name: 'name', disabled: false},
    {name: 'category', disabled: false},
    {name: 'quantity', disabled: false}
  ];

  setTimeout(() => {
    $scope.init();
  }, 100);

  $scope.init = function(){
    getSpkDetail(routeParams.id);
  }

  function getSpkDetail(id){
    $spkService.get.detailSpk(id).then(response => {
      console.log(response);
      $scope.spkDetail = response.result;
      for(var i=0; i<$scope.spkDetail.spk_result.length; i++){
        var spkItem = $scope.spkDetail.spk_result[i];
        $scope.requiredData.item.push({
          name: spkItem.name,
          category: spkItem.category,
          quantity: spkItem.quantity
        })
      }

      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.$on("chooseItemInMasterList", function(event, args){
    var item = args.state.item;
    console.log(item);
    $scope.requiredData.nextItem.push({
      name: item.name,
      category: item.category.name,
      quantity: 0
    });

  })

  $scope.$on("deleteItemInTable", function(event, args){
    var index = args.state.index;
    console.log('index '+index);
    $scope.requiredData.item.splice(index, 1);
  })

  $scope.addItemManually = function(){
    $scope.requiredData.nextItem.push({
      name: "",
      category: "",
      quantity: 0
    });

  }

  $scope.save = function(){
    for(var i=0; i < $scope.requiredData.nextItem.length; i++){
      $scope.requiredData.item.push($scope.requiredData.nextItem[i]);
    }
    setTimeout(() => { updateSpkReport($scope.requiredData); }, 300);

  }

  function updateSpkReport(data){
    console.log(data);
    $spkService.post.createSpkReport(data).then(response => {
      console.log(response);
      $rootScope.triggerModal("SPK Report berhasil diupdate", "Success", "success", "/inventory/spk");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
})
