distributionApp.controller('purchasingBPBController', function($scope, $timeout, $purchaseService, $rootScope, $modalService, $myCookies){
    var accessToken = $myCookies.get("accessToken");
  
    console.log("Purchasing BPB COntroller");

    $scope.searchFilters = [
      {by: "id", name: "ID BPB", placeholder: "Masukkan ID BPB"},
      {by: "date", name: "Tanggal BPB", placeholder: "Masukkan Tanggal BPB"},
      {by: "supplier", name: "Nama Supplier", placeholder: "Masukkan Nama Supplier"},
      {by: 'range_date', name: 'Range Tanggal'}
    ];

    $scope.headings = [
      {name: "Tanggal BPB"},
      {name: "Nomor BPB"},
      {name: "Nomor PO"},
      {name: "Nomor Kontrak"},
      {name: "Supplier"},
      {name: "Status BPB"}
    ];

  $scope.selectedFilter = {
      item: $scope.searchFilters[0]
  };

  $scope.requiredData = {
      limit: 10,
      offset: 0,
      id: '',
      date: '',
      supplier_name: '',
      s_date: '',
      e_date: ''
  }

  setTimeout(function(){
      $scope.init();
  },200);

  $scope.init = function(){
    getBPBList($scope.requiredData);
  };

  function getBPBList(data){
    $purchaseService.order.get.purchaseBPBList(data).then(function(response){
       console.log(response);
       $scope.bpbList = response.result.data;
       $scope.totalRows = response.result.row;
       $scope.$apply();
    })
    .catch(function(error){
       console.log(error);
    })
  };

  $scope.doSearchFilter = function(val, type) {
    console.log(val + " "+type);
    console.log('doing searching');
   $scope.requiredData.offset = 0;
   switch(type) {
        case "id":{
           $scope.requiredData.id = val;
           $scope.requiredData.date = "";
           $scope.requiredData.supplier_name = "";
           $scope.requiredData.s_date = "";
           $scope.requiredData.e_date = "";
           break;
        }
        case "date":{
           $scope.requiredData.date = val;
           $scope.requiredData.id = "";
           $scope.requiredData.supplier_name = "";
           $scope.requiredData.s_date = "";
           $scope.requiredData.e_date = "";
           break;
        }
        case "supplier":{
           $scope.requiredData.supplier_name = val;
           $scope.requiredData.id = "";
           $scope.requiredData.date = "";
           $scope.requiredData.s_date = "";
           $scope.requiredData.e_date = "";
           break;
        }
     }
     console.log($scope.requiredData);
     $scope.init();
  };

  $scope.exportToExcel = function(){
   location.href = api.url + "report/original/bpb?accessToken=" + accessToken + '&id=' + $scope.requiredData.id + '&date=' + $scope.requiredData.date + '&supplier_name=' + $scope.requiredData.supplier_name + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date + "&export=" + true;
   }


    
   
});
  