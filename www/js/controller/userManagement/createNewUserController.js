distributionApp.controller('createNewUserController', function($scope, $rootScope, $userService, $modalService, $warehouseService){
  $scope.requiredData = {
    username: '',
    password: '',
    name: '',
    access_id: '',
    warehouse_id: '',
    selectedAccess: null,
    selectedWarehouse: null
  }

  setTimeout(()=>{
    $scope.init();
  }, 150);

  $scope.init = function(){
    getAccessList();
    getWarehouseList();
  }

  function getWarehouseList(){
    $warehouseService.get.warehouse().then(response => {
      $scope.warehouseList = response.result;
      $scope.warehouseList.splice(0,0, {id: null, name: "-- Pilih Gudang --"});
      $scope.requiredData.warehouse_id = $scope.warehouseList[0].id;
      $scope.requiredData.selectedWarehouse = $scope.warehouseList[0];
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $scope.changeWarehouse = function(data){
    $scope.requiredData.warehouse_id = data.id;
  }
  $scope.changeAccessLevel = function(data){
    $scope.requiredData.access_id = data.id;
  }
  function getAccessList(){
    $userService.get.listAccess().then(response => {
      console.log(response);
      $scope.accessList = response.result;
      $scope.requiredData.access_id = $scope.accessList[0].id;
      $scope.requiredData.selectedAccess = $scope.accessList[0];
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  $scope.save = function(){
    createNewUser($scope.requiredData);
  }

  function createNewUser(data){
    $userService.post.createUser(data).then(response => {
      $rootScope.triggerModal("User baru berhasil ditambahkan", "Success", "success", "/usermanagement");
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }
});
