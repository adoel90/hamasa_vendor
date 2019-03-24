distributionApp.controller('paymentController', function($scope, $myCookies, $rootScope, $paymentService, $modalService){
  var accessToken = $myCookies.get("accessToken");
  $scope.requiredData = {
    limit: 10,
    offset: 0,
    invoice: '',
    customer_name: '',
    s_date: '',
    e_date: ''
  }

  $scope.headings = [
    {name: "Tgl Pembayaran"},
    {name: "Customer"},
    {name: "Total Pembayaran"}
  ];

  $scope.searchFilters = [
    {by: "invoice", name: "Invoice", placeholder: "Masukkan Invoice"},
    {by: "customer", name: "Customer", placeholder: "Masukkan Nama Customer"},
    {by: "range_date", name: "Range Tanggal"}
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.btnName = "Buat Pelunasan";

  setTimeout(function(){ $scope.init(); }, 150);

  $scope.init = function(){
    getPaymentList();
  }

  $scope.redirectToCreateNewData = function(){
    location.href = '/finance/payment/createnewpayment';
  }

  function getPaymentList(){
    $paymentService.get.paymentList($scope.requiredData).then(function(response){
      console.log(response);
      for(var i=0; i<response.result.data.length; i++){
        response.result.data[i].customerName = response.result.data[i].customer.name;
      }

      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(function(error){
      console.log(error);
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.doSearchFilter = function(val, type){
    $scope.requiredData.offset = 0;
      switch(type){
        case "invoice":{
        $scope.requiredData.invoice = val;
        $scope.requiredData.customer_name = "";
        break;
      }
      case "customer":{
        $scope.requiredData.invoice = "";
        $scope.requiredData.customer_name = val;
        break;
      }
    }
    $scope.init();
  }

  $scope.openDetailData = function(data){
    var paymentId = data.id;
    var modalOptions = {
      scope: $scope,
      templateUrl: '/dist/view/modal/detailPayment.html',
      size: 'lg'
    }
    $modalService.open(modalOptions)
    .then(function(response) {
      setTimeout(() => { $scope.modalInit(); }, 150);

      $scope.modalInit = function(){
        getPaymentDetail(paymentId);
      }

      $scope.printBkm = function(paymentId){
        location.href = api.url + "cash/in/print?accessToken=" + accessToken + "&id=" + null + "&payment_id=" + paymentId;
      }

      function getPaymentDetail(paymentId){
        $paymentService.get.paymentDetail(paymentId).then(function(response){
          console.log(response);
          $scope.paymentDetail = response.result;
          $scope.paymentDetail.total_payment = $rootScope.numberWithCommas($scope.paymentDetail.total_payment);
          $scope.paymentDetail.totalMustPay = 0;
          $scope.paymentDetail.headings = [
            {name: "Tipe Pelunasan"},
            {name: "No SO"},
            {name: "Tanggal SO"},
            {name: "Total Pembayaran"},
            {name: "Jumlah Pelunasan"},
            {name: "Stamp"}
          ];

          if(response.result.proof === "0"){
            $scope.paymentDetail.proof = "";
          }
          for(var i=0; i<response.result.invoice.length; i++){
            $scope.paymentDetail.totalMustPay += parseInt(response.result.invoice[i].total_invoice);
          }
          $scope.paymentDetail.totalMustPay = $rootScope.numberWithCommas($scope.paymentDetail.totalMustPay);
          $scope.$apply();
        })
        .catch(function(error){
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }
    })
  }

  $scope.exportToExcel = function(){
    location.href = api.url + 'report/finance/payment/list?accessToken=' + accessToken + '&export=' + true + '&invoice=' + $scope.requiredData.invoice + '&customer_name=' + $scope.requiredData.customer_name + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date;
  }

  $rootScope.$on('requestFetchData', function() {
    $scope.init();
  })

  
});
