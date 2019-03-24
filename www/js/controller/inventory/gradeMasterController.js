distributionApp.controller('gradeMasterController', function($scope, $rootScope, $gradeService, $myCookies){
  $scope.requiredData = {
    limit: 10,
    offset: 0
  }

  $scope.headings = [
    {name: "ID Grade"},
    {name: "Nama Grade"},
    {name: "Action"}
  ];

  var accessToken = $myCookies.get("accessToken");
  $scope.searchFilters = null;

  $scope.cols = ['id', 'name'];
  $scope.btnName = "Tambah Grade";
  $scope.tableType = 'master-table';

  setTimeout(() => { $scope.init(); }, 100);

  $scope.init = function(){
    getAllGrade($scope.requiredData);
  }

  function getAllGrade(data){
    $gradeService.get.listItemGrade(data).then(response => {
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.$on("editDataMaster", function(event, args){
    var gradeId = args.state.data.id;
    location.href = '/inventory/grademaster/editgrade/' + gradeId;
  })

  $scope.$on("deleteDataMaster", function(event, args){
    var gradeId = args.state.data.id;
    $rootScope.deleteConfirmationModal("Apakah Anda yakin ingin menghapus grade ini?", "Ya", "Tidak", function(){
      var data = {
        id: gradeId
      }
      $gradeService.delete.deleteItemGrade(data).then(response => {
        $rootScope.triggerModal("Grade telah dihapus!", "Success", "success", "/inventory/grademaster");
      })
      .catch(error => {
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
    });
  })

  $scope.redirectToCreateNewData = function(){
    location.href = '/inventory/grademaster/createnewgrade';
  }

  $scope.exportToExcel = function(){
    location.href = api.url + "report/inventory/item/grade?accessToken=" + accessToken + "&export=" + true;
  }

  $scope.$on('requestFetchData', function() {
    $scope.init();
  });

});
