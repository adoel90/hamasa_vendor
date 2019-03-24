distributionApp.directive('calculatePaidChanged', calculatePaidChanged);
function calculatePaidChanged($rootScope){
  return{
    restrict: 'EA',
    scope: {
      paidInvoice: '=',
      data: '='
    },
    link: function($scope, element, attrs) {
      $scope.temp = 0;

      $scope.$watch('paidInvoice', function(newValue, oldValue, scope){
        $scope.paidInvoice = newValue;
      })

      $scope.$watch('data', function(newValue, oldValue, scope){
        $scope.data = newValue;
      })

      element.bind('keyup', function(){
        if($scope.paidInvoice.length == 0){
          $scope.paidInvoice = 0;
          $scope.data.total = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.data.total)) - parseInt($scope.temp) + parseInt($rootScope.numberWithNoCommas($scope.paidInvoice)));
          $scope.data.actually_pay = $scope.data.total;
          $scope.temp = $scope.paidInvoice;
          $scope.$apply();
        }
        else{
          $scope.data.total = $rootScope.numberWithCommas(parseInt($rootScope.numberWithNoCommas($scope.data.total)) - parseInt($scope.temp) + parseInt($rootScope.numberWithNoCommas($scope.paidInvoice)));
          $scope.data.actually_pay = $scope.data.total;
          $scope.temp = $rootScope.numberWithNoCommas($scope.paidInvoice);
          $scope.$apply();
        }
      });

      element.bind('focus', function(){
        if($scope.paidInvoice.length == 0){
          paid = 0;
        }
        $scope.temp = $rootScope.numberWithNoCommas($scope.paidInvoice);
      })
    }
  }
}
