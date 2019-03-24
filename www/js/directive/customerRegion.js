distributionApp.directive('customerRegion', customerRegion);
function customerRegion($rootScope, $customerService){
  return{
    restrict: 'EA',
    templateUrl: '/dist/view/widget/customer-region-combobox.html',
    link: function($scope, element, attrs) {
      $scope.$watch(function(){
        $scope.data = $scope.$eval(attrs.data);
      })

      function getAllCustomerRegion(){
        $customerService.get.customerRegion().then(response => {
          console.log(response);
          $scope.custRegionList = response.result;
          $scope.custRegionList.splice(0, 0, {id:"", name: "-- Pilih Region--"});
          if($scope.data.region){

            for(var i=0; i < $scope.custRegionList.length; i++){
              if($scope.data.region == $scope.custRegionList[i].name){
                $scope.data.selectedCustRegion = $scope.custRegionList[i];
                break;
              }
            }
          }
          else{
            $scope.data.selectedCustRegion = $scope.custRegionList[0];
            $scope.data.region = null;
          }

          $scope.$apply();
        })
        .catch(error => {
          console.log(error);
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }

      $scope.changeCustRegion = function(data){
        $scope.data.region = data.id;
      }

      setTimeout(() => {
        getAllCustomerRegion();
      }, 100)

    }
  }

}
