distributionApp.directive('itemCategory', itemCategory);
function itemCategory($rootScope, $categoryService, $modalService){
  return{
    restrict: 'EA',
    templateUrl: '/dist/view/widget/item-category-cmbbox.html',
    scope: {
      data: '='
    },
    link: function($scope, element, attrs) {
      $scope.$watch('data', function (newValue, oldValue, scope) {
        $scope.data = newValue;
        console.log($scope.data);
      })

      setTimeout(() => { getAllItemCategory(); }, 50);

      function getAllItemCategory(){
        $categoryService.get.allCategory().then(function(response){
           console.log(response);
           $scope.categoryList = response.result;
           $scope.data.selectedCategory = $scope.categoryList[0];
           $scope.data.category_id = $scope.categoryList[0].id;
           $scope.$apply();
        })
        .catch(function(error){
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }

      $scope.changeCategory = function(data){
        $scope.data.category_id = data.id;
      }
    }
  }
}
