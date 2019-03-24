distributionApp.controller('createNewItemController', function($scope, $rootScope,
    $supplierService, $itemService, $timeout, $categoryService, $gradeService) {

    //
    $scope.groups = [
		{ code: 'U', name: 'Umum' },
		{ code: 'N', name: 'Non Standar' }
	];
   $scope.categories = [];
    //
	$scope.grades = ['-', 'A', 'B', 'C', 'D', 'F'];

    //
    $scope.requiredData = {
        id: '',
        serial: '',
        name: '',
        unit: '',
        weight: '',
        brand: '',
        item_group: $scope.groups[0].code,
        group: $scope.groups[0],
        category_id: '',
        categories: null,
        grade: null,
        supplier_id: [],
        stock_lock: false,
        supplier: [],
        selectedGrade: null
    };

    /**
     *  @name   Actions
     *  @desc   All action-based two-way binded functions are listed below.
     */
    $scope.changeGrade = function(data) {
        $scope.requiredData.grade = data.name;
    }

    $scope.changeGroup = function(data) {
        $scope.requiredData.item_group = data.code;
    }
    $scope.changeCategory = function(data){
      $scope.requiredData.category_id = data.id;
    }

    $scope.save = function() {
      console.log($scope.requiredData);

      bindListSupplierIntoSupplierIdList();

      setTimeout(()=>{
        createNewItemMaster($scope.requiredData);
      }, 400);

    }

    function bindListSupplierIntoSupplierIdList(){
      $scope.requiredData.supplier_id = [];
      for(var i=0; i < $scope.requiredData.supplier.length; i++){
        $scope.requiredData.supplier_id.push($scope.requiredData.supplier[i].id);
      }
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

    //
    $scope.init = function() {
        getAllGrades();
        getSuppliers();
        getItemMasterCategories();
    };

    function getAllGrades(){
      $gradeService.get.allGrade().then(response => {
        console.log(response);
        $scope.gradeList = response.result;
        $scope.requiredData.selectedGrade = response.result[0];
        $scope.requiredData.grade = response.result[0].id;
        $scope.$apply();
      })
      .catch(error => {
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger","");
      })
    }

    $scope.changeGrade = function(data){
      console.log('Change grade ', data.id);
      $scope.requiredData.grade = data.id;
    }

    $timeout(function() {
        $scope.init();
    });

    /**
     *  @name   Getters
     *  @desc   All the getter funtions are gathered below. Used in conjunction with
     *          $scope.init function when first rendering the page.
     */
    function getSuppliers() {
        $supplierService.get.allSuppliers().then(function(response) {
            $scope.suppliers = response.result;
            $scope.$apply();
        });
    }
    function getItemMasterCategories(){
      $categoryService.get.allCategory().then(function(response){
         $scope.categories = response.result;

         $scope.requiredData.categories = $scope.categories[0];
         $scope.requiredData.category_id = $scope.categories[0].id;
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }
})
