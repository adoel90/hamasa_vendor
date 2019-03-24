distributionApp.controller('editCategoryMasterController', function($scope, $rootScope, $modalService, $categoryService){
   $scope.categoryData = {};
   $rootScope.categoryId = encodeURIComponent(routeParams.id);

   setTimeout(function(){
      getCategoryDetail(routeParams.id);
   },200);

   function getCategoryDetail(id){
      $categoryService.get.categoryDetail(id).then(function(response){
         $scope.categoryData = {
            id: response.result.id,
            name: response.result.name
         }
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   $scope.save = function(){
      $categoryService.put.updateCategoryMaster($scope.categoryData).then(function(response){
         console.log(response);
         var modalOptions = {
             scope: $scope
         }

         $modalService.alert(modalOptions).then(function(response) {
             $scope.alert = {
                 type: 'success',
                 title: 'Sukses!',
                 message: 'Kategori berhasil diupdate',
                 button: [
                     { type: 'success', text: 'Kembali' }
                 ]
             }

             $scope.doAction = function(index) {
                 switch(index) {
                     case 0: {
                         $rootScope.redirectTo('/inventory/categorymaster');
                     }
                 }
             }
         });
      })
      .catch(function(error){
         var modalOptions = {
             scope: $scope
         }

         $modalService.alert(modalOptions).then(function(response) {
             $scope.alert = {
                 type: 'danger',
                 title: 'Error',
                 message: error.responseJSON.message,
                 button: [
                     { type: 'danger', text: 'Kembali' }
                 ]
             }

             $scope.doAction = function(index) {
                 switch(index) {
                     case 0: {
                         $modalService.close();
                     }
                 }
             }
         })
      })
   }
});
