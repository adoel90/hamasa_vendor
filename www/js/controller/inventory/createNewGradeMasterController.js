distributionApp.controller('createNewGradeMasterController', function($scope, $rootScope, $gradeService){
  $scope.grade = {
    id: '',
    name: ''
  }

  $scope.saveGrade = function(){
    $gradeService.post.createItemGrade($scope.grade).then(response => {
      $rootScope.triggerModal("Grade berhasil ditambahkan", "Success", "success", "/inventory/grademaster");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

});
