distributionApp.controller('copyItemMasterController', function($scope, $rootScope,
    $supplierService, $itemService, $modalService, $window, $timeout, $categoryService, $gradeService){

      $scope.requiredData = {
          ig_id: '',
          id: '',
          serial: '',
          name: '',
          unit: '',
          weight: '',
          brand: '',
          group: '',
          item_group: '',
          category_id: '',
          category_name: '',
          grade: '',
          supplier: [],
          supplier_id: [],
          stock_lock: ''
      };

      //
      $scope.groups = [
  		{ code: 'U', name: 'Umum' },
  		{ code: 'N', name: 'Non Standar' }
  	];

      //


      //

      $scope.changeCategory = function(data){
        $scope.requiredData.category_id = data.id;
      }

      $scope.init = function() {

          getItemDetail(routeParams.id);
      }

      $scope.changeGroup = function(group) {
          $scope.requiredData.item_group = group.code;
      }

      $scope.changeSupplier = function(supplier) {
      	$scope.requiredData.supplier = supplier;
      	$scope.requiredData.supplier_id = supplier.id;
      }

      $timeout(function() {
          $scope.init();
      });

      $scope.save = function() {

        bindListSupplierIntoSupplierIdList()
        setTimeout(()=>{
          createNewItemMaster($scope.requiredData);
        }, 300);
      }

      function createNewItemMaster(data){
        $itemService.post.addItem(data)
        .then(function(response) {
          $rootScope.triggerModal("Item master berhasil ditambahkan", "Success", "success", "/inventory/itemmaster");
        })
        .catch(function(error) {
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger");
        });
      }

      function bindListSupplierIntoSupplierIdList(){
        $scope.requiredData.supplier_id = [];
        for(var i=0; i < $scope.requiredData.supplier.length; i++){
          $scope.requiredData.supplier_id.push($scope.requiredData.supplier[i].id);
        }
      }

      function getSelectedCategories(){
        $categoryService.get.allCategory().then(function(response){
           $scope.categories = response.result;
           for(var i=0; i<$scope.categories.length; i++){
             if($scope.categories[i].id == $scope.requiredData.category_id){
               $scope.requiredData.categories = $scope.categories[i];
               break;
             }
           }
           $scope.$apply();
        })
        .catch(function(error){
           console.log(error);
        })
      }
      function getSuppliers() {
          $supplierService.get.allSuppliers().then(function(response) {
              $scope.suppliers = response.result;
              for(var i=0; i<$scope.requiredData.supplier_id.length; i++){
                for(var j=0; j<$scope.suppliers.length; j++){
                  if($scope.requiredData.supplier_id[i] == $scope.suppliers[j].id){
                    $scope.requiredData.supplier.push($scope.suppliers[j]);
                  }
                }
              }
              $scope.$apply();
          });
      }

      function getItemDetail(id) {
          $itemService.get.itemDetail(id)
              .then(function(response){
                  console.log(response);
                  var itemDetail = response.result;
                  $scope.requiredData = {
                      ig_id: id,
                      id: itemDetail.id,
                      serial: itemDetail.serial,
                      name: itemDetail.name,
                      unit: itemDetail.unit,
                      weight: itemDetail.weight,
                      brand: itemDetail.brand,
                      group: itemDetail.group,
                      item_group: itemDetail.group,
                      category_id: itemDetail.category.id,
                      category_name: itemDetail.category.name,
                      grade: itemDetail.grade,
                      supplier: itemDetail.supplier,
                      supplier_id: itemDetail.supplier.id,
                      stock_lock: itemDetail.stock_lock
                  };

                  getSelectedCategories();
                  getSuppliers();
                  getAllGrades();

                  angular.forEach($scope.groups, function(group, index) {
                      if(group.code == itemDetail.group) {
                          $scope.requiredData.group = $scope.groups[index];
                      }
                  });

                  $scope.$apply();
              })
      }

      function getAllGrades(){
        $gradeService.get.allGrade().then(response => {
          $scope.gradeList = response.result;
          for(var i=0; i<$scope.gradeList.length; i++){
            if($scope.gradeList[i].id == $scope.requiredData.grade){
              $scope.requiredData.selectedGrade = $scope.gradeList[i];
              break;
            }
          }
          $scope.$apply();
        })
        .catch(error => {
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger","");
        })
      }

      $scope.changeGrade = function(data){
        $scope.requiredData.grade = data.id;
      }

})
