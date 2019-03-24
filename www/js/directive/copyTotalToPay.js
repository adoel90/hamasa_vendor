distributionApp.directive('copyTotalToPay', copyTotalToPay);
function copyTotalToPay($rootScope){
  return{
    restrict: 'EA',
    scope: {
      invoiceData: '=',
      data: '='
    },
    link: function($scope, element, attrs) {
      $scope.$watch('invoiceData', function (newValue, oldValue, scope) {
        $scope.invoiceData = newValue;
      })
      $scope.$watch('data', function(newValue, oldValue, scope){
        $scope.data = newValue;
      })

      element.bind('click', function(){
        if($scope.invoiceData.check){
          $scope.invoiceData.paid = $rootScope.numberWithCommas( parseInt( $rootScope.numberWithNoCommas($scope.invoiceData.paid) ) + parseInt($rootScope.numberWithNoCommas($scope.invoiceData.total)) );
          $scope.data.total_should_pay = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.data.total_should_pay)) + parseInt($rootScope.numberWithNoCommas($scope.invoiceData.totalMustPay)) );
          $scope.data.total = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.data.total)) + parseInt($rootScope.numberWithNoCommas($scope.invoiceData.total)));
          $scope.data.actually_pay = $scope.data.total;

          $scope.$apply();
        }
        else{
         $scope.data.total_should_pay = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.data.total_should_pay)) - parseInt($scope.invoiceData.totalMustPay));
         $scope.data.total = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.data.total)) - parseInt($rootScope.numberWithNoCommas($scope.invoiceData.total)));
         $scope.data.actually_pay = $scope.data.total;

         if($scope.invoiceData.paid > $scope.invoiceData.total){
          $scope.invoiceData.paid = $rootScope.numberWithCommas( parseInt($rootScope.numberWithNoCommas($scope.invoiceData.paid)) - parseInt($rootScope.numberWithNoCommas($scope.invoiceData.total)) );
         }
         else{
          $scope.invoiceData.paid = 0;
         }
         
         if( parseInt($rootScope.numberWithNoCommas($scope.data.total)) < 0){
          $scope.data.total = 0;
          $scope.data.actually_pay = $scope.data.total;
          $scope.data.saldo = 0;
          $scope.$apply();
         }
         $scope.$apply();
        }
      });
    }
  }
}
