distributionApp.directive('addInvoiceStamp', addInvoiceStamp);
function addInvoiceStamp($rootScope){
  return{
    restrict: 'EA',
    scope: {
      invoiceData: '=',
      data: '='
    },
    link: function($scope, element, attrs){
      $scope.$watch('invoiceData', function (newValue, oldValue, scope) {
        $scope.invoiceData = newValue;
      })
      $scope.$watch('data', function(newValue, oldValue, scope){
        $scope.data = newValue;
      })

      element.bind('click', function(){
        if($scope.invoiceData.stamp){
          $scope.invoiceData.paid = $rootScope.numberWithCommas( parseInt( $rootScope.numberWithNoCommas($scope.invoiceData.paid) ) + parseInt($rootScope.numberWithNoCommas($scope.invoiceData.stampPrice)) );
          $scope.data.total = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.data.total)) + parseInt($rootScope.numberWithNoCommas($scope.invoiceData.stampPrice)));
          $scope.data.actually_pay = $scope.data.total;
          $scope.$apply();
        }
        else{
          console.log($scope.data.total);
          $scope.invoiceData.paid = $rootScope.numberWithCommas( parseInt( $rootScope.numberWithNoCommas($scope.invoiceData.paid) ) - parseInt($rootScope.numberWithNoCommas($scope.invoiceData.stampPrice)) );
          $scope.data.total = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.data.total)) - parseInt($rootScope.numberWithNoCommas($scope.invoiceData.stampPrice)));
          $scope.data.actually_pay = $scope.data.total;
          if( parseInt($rootScope.numberWithNoCommas($scope.data.total)) < 0){
            $scope.data.total = 0;
            $scope.data.saldo = 0;
            $scope.data.actually_pay = $scope.data.total;
            $scope.$apply();
           }
          $scope.$apply();
        }
      });

    }
  }
}
