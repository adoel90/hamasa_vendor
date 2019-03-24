distributionApp.controller('bkbTipoController', function($scope, $rootScope, $tipoService, $modalService, $myCookies){
  var accessToken = $myCookies.get("accessToken");
  $scope.searchFilters = [
    {by: "id", name: "ID BKB TIPO", placeholder: "Masukkan ID BKB TIPO"},
    {by: "date", name: "Tanggal BKB TIPO", placeholder: "Masukkan Tanggal BKB TIPO"},
    {by: "customer", name: "Nama Customer", placeholder: "Masukkan Nama Customer"},
    {by: "range_date", name: "Range Tanggal"}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.headings = [
    {name: "ID BKB TIPO"},
    {name: "Tanggal"},
    {name: "Customer"},
    {name: "ID DO TIPO"}
  ];

  $scope.requiredData = {
    limit: 10,
    offset: 0,
    id: '',
    date: '',
    customer: '',
    s_date: '',
    e_date: ''
  }

  $scope.cols = ['id', 'date', 'customerName', 'doTipoId'];
  $scope.btnName = "Buat BKB Tipo";
  $scope.tableType = 'non-edited-table';

  $scope.init = function(){
    getListBkbTipo($scope.requiredData);
  }

  $scope.redirectToCreateNewData = function(){
    location.href = '/inventory/bkbtipo/createnewbkbtipo';
  }

  $scope.doSearchFilter = function(val, type) {
    $scope.requiredData.offset = 0;

    switch(type) {
      case 'id': {
        $scope.requiredData.id = val;
        $scope.requiredData.date = '';
        $scope.requiredData.customer = '';
        $scope.requiredData.s_date = '';
        $scope.requiredData.e_date = '';
        break;
      }
      case 'date': {
        $scope.requiredData.date = val;
        $scope.requiredData.id = '';
        $scope.requiredData.customer = '';
        $scope.requiredData.s_date = '';
        $scope.requiredData.e_date = '';
        break;
      }
      case 'customer':{
        $scope.requiredData.customer = val;
        $scope.requiredData.id = '';
        $scope.requiredData.date = '';
        $scope.requiredData.s_date = '';
        $scope.requiredData.e_date = '';
        break;
      }
    }
    $scope.init();
  }

   setTimeout(function(){ $scope.init(); },150);

   $rootScope.$on('requestFetchData', function() {
		$scope.init();
	})

  function getListBkbTipo(data){
    $tipoService.get.listBkbTipo(data).then(function(response){
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].customerName = response.result.data[i].customer.name;
        response.result.data[i].doTipoId = response.result.data[i].dotipo.id;
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
    location.href = api.url + 'report/inventory/tipo/bkb?accessToken=' + accessToken + '&id=' + $scope.requiredData.id + '&date='+ $scope.requiredData.date + '&customer=' + $scope.requiredData.customer + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date + '&export='+ true;
  }

  $scope.$on("openDetailDataInTable", function(event, args){
    var bkbTipoId = args.state.data.id;
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/bkbTipoDetail.html',
      size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.detailHeadings = [
         {name: "Serial"},
         {name: "Kategori"},
         {name: "Nama Barang"},
         {name: "Berat"},
         {name: "Jumlah"}
      ];

      $tipoService.get.detailBkbTipo(bkbTipoId).then(function(response){
         $scope.detailBkbTipo = response.result;
         $scope.$apply();
      })
      .catch(function(error){
         $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })

      $scope.printBkbTipo = function(tipoId){
        location.href = api.url + "tipo/bkb/print?accessToken=" + accessToken + "&id=" + tipoId;
      }
    })

  })

});
