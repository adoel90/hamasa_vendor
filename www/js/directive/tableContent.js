distributionApp.directive('tableContent', tableContent);
function tableContent($rootScope){
  return{
    restrict: 'EA',
    scope:{
      tableHeader: '=',
      tableBody: '=',
      tableColumn: '=',
      type: '=',
      purpose: '='
    },
    templateUrl: '/dist/view/widget/table.html',
    link: function($scope, element, attrs) {
      $scope.$watch('type', function(newValue, oldValue, scope){
        $scope.type = newValue;
      })
      $scope.$watch('purpose', function(newValue, oldValue, scope){
        $scope.purpose = newValue;
      })
      $scope.$watch('tableHeader', function(newValue, oldValue, scope){
        $scope.tableHeader = newValue;
      })
      $scope.$watch('tableBody', function(newValue, oldValue, scope){
        $scope.tableBody = newValue;
      })
      $scope.$watch('tableColumn', function(newValue, oldValue, scope){
        $scope.tableColumn = newValue;
      })
      $scope.openDetailData = function(data){
        if($scope.purpose !== 'modal'){
          $rootScope.$broadcast("openDetailDataInTable", {state: {data} });
        }
      }
      $scope.deleteItem = function(index){
        $rootScope.$broadcast("deleteItemInTable", {state: {index} });
      }
      $scope.editData = function(data){
        $rootScope.$broadcast("editDataMaster", { state: {data} })
      }
      $scope.deleteData = function(data){
        $rootScope.$broadcast("deleteDataMaster", { state: {data} })
      }
    }
  }
}
