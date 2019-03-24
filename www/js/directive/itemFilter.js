distributionApp.directive('itemFilter', itemFilter);
function itemFilter($rootScope){
  return{
    restrict: 'EA',
    scope: {
      data: '='
    },
    templateUrl: '/dist/view/widget/item-filter.html',
    link: function($scope, element, attrs) {

      $scope.$watch('data', function(newValue, oldValue, scope){
        $scope.data = newValue;
      })

      $scope.firstSearchVal = "";
    	$scope.secondSearchVal = "";

      $scope.firstSearchFilters = [
    		{ by: 'code', name: 'Kode Barang', placeholder: 'Masukkan kode barang' },
    		{ by: 'name', name: 'Nama Barang', placeholder: 'Masukkan nama barang' },
    		{ by: 'category', name: 'Kategori', placeholder: 'Masukkan kategori' }
    	];

    	$scope.secondSearchFilters = [
    		{ by: 'supplier', name: 'Supplier', placeholder: 'Masukkan Supplier' },
    		{ by: 'grade', name: 'Grade', placeholder: 'Masukkan Grade' }
    	];

      $scope.firstSelectedFilter = {
    		item: $scope.firstSearchFilters[0]
    	};

    	$scope.secondSelectedFilter = {
    		item: $scope.secondSearchFilters[0]
    	}

      $scope.doSearchFilter = function(firstVal, firstSearchType, secondVal, secondSearchType) {
    		switch(firstSearchType){
    			case 'code':{
    				$scope.data.id = firstVal ? firstVal : "";
    				$scope.data.name = "";
    				$scope.data.category = "";
    				break;
    			}
    			case 'name':{
    				$scope.data.id = "";
    				$scope.data.name = firstVal ? firstVal : "";
    				$scope.data.category = "";
    				break;
    			}
    			case 'category':{
    				$scope.data.id = "";
    				$scope.data.name = "";
    				$scope.data.category = firstVal ? firstVal : "";
    				break;
    			}
    		}
    		switch(secondSearchType){
    			case 'supplier':{
    				$scope.data.supplier = secondVal ? secondVal : "";
    				$scope.data.grade = "";
    				break;
    			}
    			case 'grade':{
    				$scope.data.supplier = "";
    				$scope.data.grade = secondVal ? secondVal : "";
    				break;
    			}
    		}

    		setTimeout(()=>{
    			$rootScope.$broadcast('initDataByFilter');
    		},200);

    	}
    }
  }
}
