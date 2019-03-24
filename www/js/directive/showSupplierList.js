distributionApp.directive('showSupplierList', showSupplierList);
function showSupplierList($rootScope, $modalService, $supplierService){
  return{
    restrict: 'EA',
    link: function($scope, element, attrs) {
      $scope.modalName = "List Supplier";
      $scope.modalHeadings = [
        {name: "ID Supplier"},
        {name: "Nama Supplier"},
        {name: "NPWP"}
      ];
      $scope.searchFilters = [
        {by: "name", name: "Nama Supplier", placeholder: "Masukkan Nama Supplier"},
        {by: "id", name: "ID Supplier", placeholder: "Masukkan ID Supplier"} 
      ];
      $scope.selectedFilter = {
         item: $scope.searchFilters[0]
      }

      $scope.modalCols = ["id", "name", "npwp"];
      $scope.modalTableType = 'non-edited-table';

      element.bind('click', function(){
        var modalOptions = {
          scope: $scope,
          templateUrl: '/dist/view/modal/supplierList.html',
          size: 'lg'
        }

        $modalService.open(modalOptions)
        .then(function(response) {
          $scope.requiredData = {
            limit: 10,
            offset: 0,
            id: '',
            name: ''
          }

          setTimeout(() => { $scope.supplierInit(); }, 150);

          $scope.supplierInit = function(){
            getListSupplier($scope.requiredData);
          }

          function getListSupplier(data){
            $supplierService.get.supplier(data).then(response => {
              $scope.listModalData = response.result.data;
              $scope.totalRows = response.result.row;
              $scope.$apply();
            })
            .catch(error => {
              $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
            })
          }

          $scope.doSearchFilter = function(val, type){
             $scope.requiredData.offset = 0;
             switch(type){
                case "id":{
                   $scope.requiredData.id = val;
                   $scope.requiredData.name = "";
                   break;
                }
                case "name":{
                   $scope.requiredData.name = val;
                   $scope.requiredData.id = "";
                   break;
                }
             }
             $scope.supplierInit();
          }

          $scope.$on("openDetailDataInTable", function(event, args){
            var supplier = args.state.data;
            $scope.$broadcast("chooseSupplier", { state: { supplier } });
          })

          $scope.$on("requestFetchData", function(){
            $scope.supplierInit();
          })
        })

      })

    }
  }
}
