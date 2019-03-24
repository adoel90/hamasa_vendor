distributionApp.controller('editGradeMasterController', function($scope, $rootScope, $gradeService){
  $scope.purpose = "Edit Grade";
  $scope.grade = null;
  $rootScope.gradeId = encodeURIComponent(routeParams.id);

  setTimeout(() => {
    $scope.init();
  }, 150);

  $scope.init = function(){
    getGradeDetail(routeParams.id);
  }

  function getGradeDetail(id){
    $gradeService.get.detailItemGrade(id).then(response => {
      $scope.grade = response.result;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.saveGrade = function(){
    $gradeService.put.updateItemGrade($scope.grade).then(response => {
      $rootScope.triggerModal("Grade berhasil diupdate", "Success", "success", "/inventory/grademaster");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

});
