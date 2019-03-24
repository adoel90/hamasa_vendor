distributionApp.directive('bank', bank);
function bank($rootScope, $bankService){
  return{
    restrict: 'EA',
    templateUrl: '/dist/view/widget/bank-combobox.html',
    link: function($scope, element, attrs) {

      $scope.$watch(function() {
				$scope.data = $scope.$eval(attrs.data);
			})

      $scope.changeBank = function(data){
    		$scope.data.bank = data.account;
    	}

      getAllBank();

      function getAllBank(){
        $bankService.get.allBank().then(response => {
          $scope.bankList = response.result;
          $scope.bankList.splice(0, 0, {account: null, bank: "-- Pilih Bank --"});
          $scope.data.selectedBank = $scope.bankList[0];
          $scope.$apply();
        })
        .catch(error => {
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }

    }
  }
}
