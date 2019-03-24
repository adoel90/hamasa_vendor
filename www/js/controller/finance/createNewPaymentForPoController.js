distributionApp.controller('createNewPaymentForPoController', function($scope, $rootScope, $paymentService, $supplierService, $modalService, $invoiceService, $bankService, $myCookies, $moment){
  var accessToken = $myCookies.get("accessToken");
  $scope.poPaymentData = {
    date: $moment(new Date()).format('YYYY-MM-DD'),
    supplier: null,
    total_should_pay: 0,
    total: 0,
    method: null,
    bank: null,
    proof: null,
    due_date: null,
    invoice: [],
    selectedPaymentMethod: null,
    selectedBank: null,
    listInvoice: []
  }

  $scope.headings = [
    {name: "No Invoice"},
    {name: "Tanggal"},
    {name: "Total Pembayaran"},
    {name: "Jumlah Pelunasan"},
    {name: "Select"}
  ];

  $scope.copyValue = function(paid){
    if(paid.length == 0){
      console.log('kosong lho');
      paid = 0;
    }
    $scope.temp = $rootScope.numberWithNoCommas(paid);
  }

  $scope.$on("chooseSupplier", function(event, args){
    var supplier = args.state.supplier;
    $scope.poPaymentData.supplier = supplier.id;
    getDetailSupplier(supplier);
    getInvoiceListBasedOnSupplier(supplier.id);
    $modalService.close();
  })

  function getDetailSupplier(supplier){
    $scope.supplier = {
      id: supplier.id,
      name: supplier.name,
      npwp: supplier.npwp,
      address: supplier.address
    }
  }

  function getInvoiceListBasedOnSupplier(supplierId){
    $invoiceService.get.invoiceListBasedOnSupplier(supplierId).then(response => {
      console.log(response);
      for(var i=0; i<response.result.length; i++){
        $scope.poPaymentData.listInvoice.push({
          id: response.result[i].id,
          date: response.result[i].date,
          po: response.result[i].po,
          total: response.result[i].total,
          totalMustPay: response.result[i].total,
          paid: 0,
          check: false
        });
      }
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.$on("createPayment", function(){
    createPoPayment($scope.poPaymentData);
  })


  function createPoPayment(data){
    $paymentService.post.createPaymentForPo(data).then(response => {
      console.log(response);
      var redirctToBKK = api.url + "cash/out/print?accessToken=" + accessToken + "&id=" + null + "&payment_id=" + response.result;
      $rootScope.triggerModal("Payment untuk PO berhasil dibuat!", "Success", "success", redirctToBKK);
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

})
