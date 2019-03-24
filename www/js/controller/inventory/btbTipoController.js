distributionApp.controller('btbTipoController', function($scope, $rootScope, $tipoService, $modalService, $myCookies){
  var accessToken = $myCookies.get('accessToken');

  $scope.searchFilters = [
    {by: "id", name: "No TIPO", placeholder: "Masukkan No Tipo"},
    {by: "date", name: "Tanggal TIPO", placeholder: "Masukkan tanggal Tipo"},
    {by: "customer", name: "Customer", placeholder: "Masukkan nama customer"},
    {by: "range_date", name: "Range Tanggal"}
  ];

  $scope.headings = [
    {name: 'NO TIPO'},
    {name: 'TANGGAL'},
    {name: 'CUSTOMER'}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.requiredData = {
    limit: 10,
    offset: 0,
    id: '',
    date: '',
    customer: '',
    s_date: '',
    e_date: ''
  }

  $scope.cols = ['id', 'date', 'customerName'];
  $scope.btnName = "Buat BTB Tipo";
  $scope.tableType = 'non-edited-table';

  $scope.init = function(){
    getListTipo();
  }

  $scope.redirectToCreateNewData = function(){
    location.href = '/inventory/btbtipo/createnewbtbtipo';
  }

  function getDetailTipo(id){
    $tipoService.get.detailBtbTipo(id).then(function(response){
      $scope.tipoDetail = response.result;
      $scope.tipoDetail.headings = [
      {name: "Serial"},
      {name: "Kategori"},
      {name: "Nama Barang"},
      {name: "Berat"},
      {name: "Quantity"},
      {name: "Keterangan"}
      ]
      $scope.$apply();
    })
    .catch(function(error){
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
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

  $scope.exportToExcel = function(){
    location.href = api.url + "report/inventory/tipo/btb?accessToken=" + accessToken + "&export=" + true + '&id=' + $scope.requiredData.id + '&date=' + $scope.requiredData.date + '&customer='+ $scope.requiredData.customer + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date;
  }

  $scope.$on("openDetailDataInTable", function(event, args){
    var btbTipoId = args.state.data.id;
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/tipoDetail.html',
      size: 'lg'
    }
    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.detailHeadings = [
      {name: "Kategori"},
      {name: "Nama Barang"},
      {name: "Berat"},
      {name: "Jumlah"},
      {name: "Keterangan"}
      ];

      $scope.modalInit = function(){
        getDetailTipo(btbTipoId);
      }

      $scope.printBtbTipo = function(tipoId){
        location.href = api.url + "tipo/print?accessToken=" + accessToken + "&id=" + tipoId;
      }
      setTimeout(function(){ $scope.modalInit(); },100);
    })
  });

  $scope.exportToExcel = function(){
    location.href = api.url + 'report/inventory/tipo/btb?accessToken=' + accessToken + '&id=' + $scope.requiredData.id + '&date=' + $scope.requiredData.date + '&customer=' + $scope.requiredData.customer + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date + '&export=' + true;
  }

  function getListTipo(){
    $tipoService.get.listBtbTipo($scope.requiredData).then(function(response){
      for(var i=0; i<response.result.data.length; i++){
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

  setTimeout(function(){ $scope.init(); },150);

  $rootScope.$on('requestFetchData', function() {
    $scope.init();
  })

});
