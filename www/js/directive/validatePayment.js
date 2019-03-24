distributionApp.directive('validatePayment', validatePayment);
function validatePayment($rootScope){
  return{
    restrict: 'EA',
    scope: {
      data: '=',
      purpose: '='
    },
    link: function($scope, element, attrs) {
      $scope.$watch('data', function(newValue, oldValue, scope){
        $scope.data = newValue;
        console.log($scope.data);
      })
      $scope.$watch('purpose', function(newValue, oldValue, scope){
        $scope.purpose = newValue;
      })
      element.bind('submit', function(){
        $scope.data.invoice = [];
        $scope.invalidPayAmount = false;
        $scope.bankIsRequired = false;

        setTimeout(function(){
          for(var i=0; i < $scope.data.listInvoice.length; i++){

            var invoiceData = $scope.data.listInvoice[i];
            
            console.log('paid', invoiceData.paid);
            console.log('totalmustpay', invoiceData.totalMustPay)
            if(parseInt($rootScope.numberWithNoCommas(invoiceData.paid)) > parseInt(invoiceData.totalMustPay) ){
              $scope.invalidPayAmount = true;
              break;
            }
            else if( ($scope.data.selectedPaymentMethod.id > 0) && ($scope.data.bank == null) ){
              $scope.bankIsRequired = true;
              break;
            }
            else{
              if($scope.purpose == 'poPayment'){
                if(invoiceData.check){
                   $scope.data.invoice.push({
                     id: invoiceData.id,
                     paid: parseInt($rootScope.numberWithNoCommas(invoiceData.paid)),
                   });
                }
              }
              else{
                if(invoiceData.check){
                  console.log(invoiceData);
                   $scope.data.invoice.push({
                     id: invoiceData.id,
                     paid: parseInt($rootScope.numberWithNoCommas(invoiceData.paid)),
                     stamp: invoiceData.stamp,
                     inv_total: invoiceData.total
                   });
                }
              }
            }

          }
        },500);

        setTimeout(function(){
          if($scope.invalidPayAmount){
            $rootScope.triggerModal("Jumlah pelunasan invoice tidak boleh lebih besar dari total pembayaran", "Error", "danger", "");
          }
          else if($scope.bankIsRequired){
            $rootScope.triggerModal("Bank harus diisi apabila metode pembayaran transfer, cek atau giro", "Error", "danger", "");
          }
          else if($scope.data.invoice.length == 0){
            $rootScope.triggerModal("Silahkan isi invoice yg harus dilunaskan", "Error", "danger", "");
          }
          else{
            $scope.data.total = parseInt($rootScope.numberWithNoCommas($scope.data.total) );
            $rootScope.$broadcast("createPayment");
          }
        },750);

      });
    }
  }
}
