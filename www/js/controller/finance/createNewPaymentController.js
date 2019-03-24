distributionApp.controller('createNewPaymentController', function($scope, $rootScope, $paymentService, $modalService, $customerService, $bankService, $myCookies, $moment){
   var accessToken = $myCookies.get('accessToken');
   $scope.paymentData = {
      date: $moment(new Date()).format('YYYY-MM-DD'),
      total: 0,
      method: null,
      customer_bank: null,
      bank: null,
      proof: "",
      due_date: "",
      customer_id: "",
      total_should_pay: 0,
      listInvoice: [],
      invoice: [],
      selectedBank: null,
      selectedPaymentMethod: null,
      saldo: 0,
      actually_pay: 0,
      tanda_terima: "",
      ppn_repayment: 0
   }

   $scope.customerData = {
    name: "",
    address: "",
    npwp: "",
    saldo: 0
  }

   $scope.bankList = null;

   $scope.headings = [
      {name: "Jenis Pembayaran"},
      {name: "Nomor Invoice"},
      {name: "Tanggal"},
      {name: "DPP"},
      {name: "Total Pembayaran"},
      {name: "Jumlah Pelunasan"},
      {name: "Select"},
      {name: "Stamp"}
   ];


   $scope.$on("chooseCustomer", function(event, args){
     var custId = args.state.customer.id;
     $paymentService.get.customerInvoice(custId).then(function(response){
      console.log(response);
      $scope.paymentData.listInvoice = [];
      $scope.paymentData.customer_id = response.result.customer.id;

      $scope.customerData.name = response.result.customer.name;
      $scope.customerData.address = response.result.customer.address[0].address;
      $scope.customerData.npwp = response.result.customer.npwp;
      $scope.custSaldo = response.result.customer.saldo;
      $scope.customerData.saldo = $rootScope.numberWithCommas(response.result.customer.saldo);
      
      $scope.paymentData.total_should_pay = 0;
      $scope.paymentData.total = 0;

      $scope.$apply();

      for(var i=0; i<response.result.invoice.length; i++){
        if(response.result.invoice[i].type == 'so'){
          $scope.paymentData.listInvoice.push({
            type: response.result.invoice[i].type,
            id: response.result.invoice[i].id,
            date: response.result.invoice[i].date,
            dpp: response.result.invoice[i].dpp,
            totalMustPay: parseInt(response.result.invoice[i].total) + parseInt(response.result.invoice[i].stamp),
            total: parseInt(response.result.invoice[i].total),
            paid: 0,
            check: false,
            stamp: false,
            stampPrice: response.result.invoice[i].stamp,
            inv_total: response.result.invoice[i].total
          })
        }
        else{
          $scope.paymentData.listInvoice.push({
            type: response.result.invoice[i].type,
            id: response.result.invoice[i].id,
            date: response.result.invoice[i].date,
            totalMustPay: parseInt(response.result.invoice[i].total),
            total: parseInt(response.result.invoice[i].total),
            paid: 0,
            check: false,
            stamp: false,
            stampPrice: response.result.invoice[i].stamp
          })
        }
      }

     setTimeout( () => {
       $scope.paymentData.total_should_pay = $rootScope.numberWithCommas($scope.paymentData.total_should_pay);
       $scope.$apply();
     }, 300)

    })
    .catch(function(error){
       $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })

   })

   $scope.temp2 = 0; $scope.subtotalInvoice = 0;
   $scope.copySaldo = function(saldo){
    if(saldo.length == 0){
      console.log('masuk length 0');
      $scope.temp2 = 0;
    }
    else{
      $scope.temp2 = parseInt($rootScope.numberWithNoCommas(saldo));
    }
    $scope.subtotalInvoice = 0;
    for(var i=0; i< $scope.paymentData.listInvoice.length; i++){
      $scope.subtotalInvoice += parseInt($rootScope.numberWithNoCommas($scope.paymentData.listInvoice[i].paid));
     }
   }

   $scope.calculateTotalAfterSaldoChaged = function(saldo){
    if( parseInt($rootScope.numberWithNoCommas(saldo)) > $scope.subtotalInvoice){
      $rootScope.triggerModal("Saldo yg ingin digunakan jangan lebih besar dari jumlah uang yg harus dibayar customer", "Error", "danger", "");
      $scope.paymentData.saldo = $rootScope.numberWithCommas($scope.temp2);
    }
    else{    
      if(saldo.length == 0){
        saldo = 0;
        $scope.paymentData.total = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.paymentData.total)) + $scope.temp2 - parseInt($rootScope.numberWithNoCommas(saldo)));
        $scope.temp2 = 0;
      }
      else{
        $scope.paymentData.total = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.paymentData.total)) + $scope.temp2 - parseInt($rootScope.numberWithNoCommas(saldo)));
        $scope.temp2 = parseInt($rootScope.numberWithNoCommas(saldo));
      }
    }
    
   }

   $scope.$on("createPayment", function(){
    if(!$scope.paymentData.actually_pay){
      $rootScope.triggerModal("Jumlah uang yg dibayar customer tidak boleh kurang dari jumlah yg harus dibayar", "Error", "danger", "");
    }
    else if( parseInt($rootScope.numberWithNoCommas($scope.paymentData.actually_pay)) < parseInt($rootScope.numberWithNoCommas($scope.paymentData.total)) ){
      $rootScope.triggerModal("Jumlah uang yg dibayar customer tidak boleh kurang dari jumlah yg harus dibayar", "Error", "danger", "");
    }
    else{
      $scope.paymentData.saldo = $rootScope.numberWithNoCommas($scope.paymentData.saldo);
      $scope.paymentData.total = $rootScope.numberWithNoCommas($scope.paymentData.actually_pay);
      setTimeout(() => { 
        console.log($scope.paymentData);
        createPayment($scope.paymentData); 
      }, 150);
    }
   })

   function createPayment(data){
     $paymentService.post.createPayment(data).then(function(response){
        var redirectToBKM = api.url + "cash/in/print?accessToken=" + accessToken + "&id=" + null + "&payment_id=" + response.result;
        location.href = redirectToBKM;
     })
     .catch(function(error){
       $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
     })
   }


});
