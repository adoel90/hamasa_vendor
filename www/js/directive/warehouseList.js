distributionApp.directive('warehouseList', warehouseList);
function warehouseList($rootScope, $warehouseService){
  return {
    restrict: 'EA',
    scope: {
      warehouseId: '='
    },
    templateUrl: '/dist/view/widget/warehouse-combobox.html',
    link: function($scope, element, attrs) {

      $scope.$watch('warehouseId', function (newValue, oldValue, scope) {
        $scope.warehouseId = newValue;
      })

      setTimeout(() => { getAllWarehouse(); }, 70);

      function getAllWarehouse(){
        $warehouseService.get.warehouse().then(response => {
          $scope.warehouseList = response.result;
          $scope.warehouseList.splice(0, 0, {id: null, name: "-- Pilih Gudang --"});
          $scope.selectedWarehouse = $scope.warehouseList[0];
          $scope.warehouseId = $scope.warehouseList[0].id;
          $scope.$apply();
        })
        .catch(error => {
          console.log(error);
        })
      }

      $scope.changeWarehouse = function(data){
        $scope.warehouseId = data.id;
      }
      
    }
  }
}
