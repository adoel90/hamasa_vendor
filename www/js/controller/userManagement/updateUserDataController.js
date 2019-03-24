distributionApp.controller('updateUserDataController', function($scope, $rootScope, $userService, $warehouseService){
  $scope.currrentPath = "/usermanagement/updateuserdata";
  $rootScope.userId = encodeURIComponent(routeParams.id);
  $scope.requiredData = {};

  $scope.changeWarehouse = function(data){
    $scope.requiredData.warehouse_id = data.id;
  }

  $scope.changeAccessLevel = function(data){
    $scope.requiredData.access_id = data.id;
  }

  setTimeout(()=> {
    $scope.init();
  }, 150);

  $scope.init = function(){
    getUserDetail();

  }

  function getUserDetail(){
    $userService.get.userDetail(routeParams.id).then(response => {
      console.log(response);
      $scope.requiredData = {
        user_id: routeParams.id,
        name: response.result.name,
        username: response.result.username,
        access_id: response.result.access.id,
        warehouse_id: response.result.warehouse ? response.result.warehouse.id : null,
        selectedAccess: null,
        selectedWarehouse: null
      }
      getSelectedAccessLevel();
      getSelectedWarehouse();
      setTimeout(()=>{
        $scope.$apply();
      },250);

    })
    .catch(error => {
      console.log(error);
    })
  }
  function getSelectedWarehouse(){
    $warehouseService.get.warehouse().then(response => {
      $scope.warehouseList = response.result;
      $scope.warehouseList.splice(0, 0, {id: null, name: "-- Pilih Gudang --"});
      if($scope.requiredData.warehouse_id){
        for(var i=0; i<$scope.warehouseList.length; i++){
          if($scope.warehouseList[i].id == $scope.requiredData.warehouse_id){
            $scope.requiredData.selectedWarehouse = $scope.warehouseList[i];
            break;
          }
        }
      }
      else{
        $scope.requiredData.selectedWarehouse = $scope.warehouseList[0];
      }

      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }
  function getSelectedAccessLevel(){
    $userService.get.listAccess().then(response => {
      $scope.accessList = response.result;
      for(var i=0; i<$scope.accessList.length; i++){
        if($scope.accessList[i].id == $scope.requiredData.access_id){
          $scope.requiredData.selectedAccess = $scope.accessList[i];
          break;
        }
      }
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $scope.save = function(){
    updateUserProfile($scope.requiredData);
  }
  function updateUserProfile(data){
    $userService.put.updateUserProfileAndAccessLevel(data).then(response => {
      $rootScope.triggerModal("Data user berhasil diupdate", "Success", "success", "/usermanagement");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
})
