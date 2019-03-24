distributionApp.controller('poPaymentController', function($scope, $rootScope, $paymentService, $modalService, $myCookies){

  var accessToken = $myCookies.get("accessToken");
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    id: '',
    supplier: '',
    s_date: '',
    e_date: ''
  }

  $scope.headings = [
    {name: "Payment ID"},
    {name: "Tanggal PO"},
    {name: "Supplier"},
    {name: "Total Pembayaran"}
  ];

  $scope.searchFilters = [
    {by: "id", name: "ID Payment", placeholder: "Masukkan ID Payment"},
    {by: "supplier", name: "Nama Supplier", placeholder: "Masukkan Nama Supplier"},
    {by: "range_date", name: "Range Tanggal"}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.cols = ['id', 'date', 'supplierName', 'total'];
  $scope.btnName = "Buat Pelunasan";
  $scope.tableType = 'non-edited-table';

  setTimeout(() => { $scope.init(); }, 150);

  $scope.redirectToCreateNewData = function(){
    location.href = '/finance/popayment/createnewpayment';
  }

  $scope.init = function(){
    getPoPaymentList($scope.requiredData);
  }

  function getPoPaymentList(data){
    $paymentService.get.poPaymentList(data).then(response => {
      console.log(response);
      for(var i=0; i < response.result.data.length; i++){
        response.result.data[i].supplierName = response.result.data[i].supplier.name;
      }
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.openDetailData = function(data){
    var paymentId = data.id;
    var modalOptions = {
      scope: $scope,
			templateUrl: '/dist/view/modal/poPaymentDetail.html',
			size: 'lg'
    }

    $modalService.open(modalOptions)
    .then(function(response) {
      $scope.paymentDetailHeadings = [
        {name: "No Invoice"},
        {name: "No PO"},
        {name: "Jumlah yg harus dibayar"},
        {name: "Jumlah yg dibayarkan"}
      ];

      getPoPaymentDetail(paymentId);
    })
  }

  function getPoPaymentDetail(id){
    $paymentService.get.poPaymentDetail(id).then(response => {
      console.log(response);
      $scope.poPaymentDetail = response.result;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.doSearchFilter = function(val, type){
    $scope.requiredData.offset = 0;
    switch(type){
      case "id":{
        $scope.requiredData.id = val;
        $scope.requiredData.supplier = "";
        break;
      }
      case "supplier":{
        $scope.requiredData.id = "";
        $scope.requiredData.supplier = val;
        break;
      }
    }
    $scope.init();
  }

  $scope.exportToExcel = function(){
    location.href = api.url + "report/finance/payment/po?accessToken=" + accessToken + "&export=" + true + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date;
  }

  $rootScope.$on('requestFetchData', function() {
    $scope.init();
  })

})
