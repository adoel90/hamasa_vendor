distributionApp.controller('itemCuttingCostController', function($scope, $rootScope, $salesService, $itemService, $modalService, $myCookies){
  //SO/201710/72
  var accessToken = $myCookies.get("accessToken");
  $scope.requiredData = {
    so_id: '',
    items: [],
    s_date: '',
    e_date: ''
  }

  $scope.searchFilters = [
		{ by: 'range_date', name: 'Range Tanggal' }
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
  }
  
  $scope.headings = [
    {name: "No Seri"},
    {name: "Nama Barang"},
    {name: "Kategori"},
    {name: "Berat"},
    {name: "Satuan"},
    {name: "Grade"},
    {name: "Quantity"},
    {name: "Harga Potong"}
  ];

  $scope.viewSoDetail = function(id){
    $salesService.get.salesOrderDetail(id).then(response => {
      console.log(response);
      $scope.requiredData.items = response.result.item;
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $scope.triggerModal = function(customMessage, customTitle, modalType){
     var modalOptions = {
        scope: $scope
     }

     $modalService.alert(modalOptions)
        .then(function() {
           $scope.alert = {
              type: modalType,
              title: customTitle,
              message: customMessage,
              button: [
                 { type: modalType, text: 'Kembali' }
              ]
           }

           $scope.doAction = function(index) {
              switch(index) {
                 case 0: {
                    $modalService.close();
                    if(modalType == "success") $rootScope.redirectTo('/sales/cuttingcost');
                    break;
                 }
              }
           }

        })
        .catch(function(error) {
           console.warn(error);
        })
  }

  $scope.save = function(){
    var validationSucceed = true;

    setTimeout(() => {
      for(var i=0; i < $scope.requiredData.items.length; i++){
        if(isNaN($scope.requiredData.items[i].cut_cost.toString().replace(/,/g , ""))){
          validationSucceed = false;
          break;
        }
        else{
          $scope.requiredData.items[i].cut_cost = $scope.requiredData.items[i].cut_cost.toString().replace(/,/g , "");
        }
      }
    }, 300);

    setTimeout(() => {
      if(validationSucceed){
        createItemCuttingCost($scope.requiredData);
      }
      else{
        $scope.triggerModal("Harga potong harus numerik", "Error", "danger");
      }
    }, 700)

  }
  function createItemCuttingCost(data){
    $itemService.post.createItemCut(data).then(response => {
      console.log(response);
      $scope.triggerModal("Pemotongan item telah dibuat", "Success", "success");
    })
    .catch(error => {
      console.log(error);
      $scope.triggerModal(error.responseJSON.message, "Error", "danger");
    })
  }

  $scope.exportToExcel = function(){
    location.href = api.url + "report/original/invoice/cut?accessToken=" + accessToken + "&export=" + true + "&s_date=" + $scope.requiredData.s_date + "&e_date=" + $scope.requiredData.e_date;
  }

})
