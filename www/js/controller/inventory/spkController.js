distributionApp.controller('spkController', function($scope, $rootScope, $spkService, $modalService, $myCookies){

  var accessToken = $myCookies.get("accessToken");
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    id: '',
    date: '',
    customer: '',
    s_date: '',
    e_date: ''
  }

  $scope.headings = [
    {name: "No Spk"},
    {name: "Tanggal"},
    {name: "Customer"}
  ];

  $scope.searchFilters = [
    {by: "id", name: "ID SPK", placeholder: "Masukkan ID SPK"},
    {by: "date", name: "Tanggal SPK", placeholder: "Masukkan Tanggal SPK"},
    {by: "customer", name:"Nama Customer", placeholder: "Masukkan Nama Customer"},
    {by: "range_date", name: "Range Tanggal"}
  ];


  $scope.cols = ['id', 'date', 'customerName'];
  $scope.btnName = null;
  $scope.tableType = 'non-edited-table';

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.doSearchFilter = function(val, type){
    $scope.requiredData.offset = 0;
    switch(type){
      case "id" : {
        $scope.requiredData.id = val;
        $scope.requiredData.date = "";
        $scope.requiredData.customer = "";
        $scope.requiredData.s_date = "";
        $scope.requiredData.e_date = "";
        break;
      }
      case "date" : {
        $scope.requiredData.date = val;
        $scope.requiredData.id = "";
        $scope.requiredData.customer = "";
        $scope.requiredData.s_date = "";
        $scope.requiredData.e_date = "";
        break;
      }
      case "customer" : {
        $scope.requiredData.customer = val;
        $scope.requiredData.id = "";
        $scope.requiredData.date = "";
        $scope.requiredData.s_date = "";
        $scope.requiredData.e_date = "";
        break;
      }
    }
    $scope.init();
  }

  function getSpkList(data){
    $spkService.get.listSpk(data).then(function(response){
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].customerName = response.result.data[i].customer.name;
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
    location.href = api.url + 'report/inventory/spk/list?accessToken=' + accessToken + '&id='+ $scope.requiredData.id + '&date=' + $scope.requiredData.date + '&customer=' + $scope.requiredData.customer + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date + '&export=' + true;
  }

  $scope.init = function(){
    getSpkList($scope.requiredData);
  }

  setTimeout(function(){ $scope.init(); }, 150);

  $scope.$on('requestFetchData', function(event, args) {
    $scope.init();
  });

  $scope.$on("openDetailDataInTable", function(event, args){
    var spkId = args.state.data.id;
    var modalOptions = {
       scope: $scope,
       templateUrl: '/dist/view/modal/spkDetail.html',
       size: 'lg'
    }
    $scope.columns = ['category', 'name', 'quantity', 'note'];

    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.detailHeadings = [
         {name: "Kategori"},
         {name: "Nama Barang"},
         {name: "Jumlah"},
         {name: "Keterangan"}
      ];

      $scope.printSpk = function(spkId){
        location.href = api.url + "spk/print?accessToken=" + accessToken + "&id=" + spkId;
      }

      $spkService.get.detailSpk(spkId).then(function(response){
        console.log(response);
        $scope.spkDetail = response.result;
        $scope.$apply();
      })
      .catch(function(error){
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })

    })
  })

});
