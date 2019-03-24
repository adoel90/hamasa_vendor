distributionApp.directive('paymentMethod', paymentMethod);
function paymentMethod($rootScope){
  return{
    restrict: 'EA',
    templateUrl: '/dist/view/widget/payment-method-combobox.html',
    link: function($scope, element, attrs) {

      $scope.$watch(function() {
				$scope.data = $scope.$eval(attrs.data);
			})

      $scope.paymentMethodList = [
         {id: 1, name: "Transfer"},
         {id: 0, name: "Tunai"},
         {id: 2, name: "Cek"},
         {id: 3, name: "Giro"},
         {id: -1, name: "-"}
      ];

      setTimeout(() => {
        $scope.data.selectedPaymentMethod = $scope.paymentMethodList[0];
        $scope.data.method = $scope.paymentMethodList[0].id;
        $scope.$apply();
      }, 70);


      $scope.changePaymentMethod = function(data){
         $scope.data.method = data.id;
      }

    }
  }
}
