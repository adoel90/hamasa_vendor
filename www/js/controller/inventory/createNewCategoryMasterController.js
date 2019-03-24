distributionApp.controller('createNewCategoryMasterController', function($scope, $rootScope, $modalService, $categoryService){
   $scope.categoryData = {
      id: '',
      name: ''
   }

   $scope.save = function(){
      createNewCategory($scope.categoryData);
   }

   function createNewCategory(data){
      $categoryService.post.createCategoryMaster(data).then(function(response){
        $rootScope.triggerModal("Kategori berhasil dibuat", "Success", "success", "/inventory/categorymaster");
      })
      .catch(function(error){
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
   }

})
