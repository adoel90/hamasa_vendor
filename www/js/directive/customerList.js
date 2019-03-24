distributionApp.directive('customerList', chooseCustomer);
function chooseCustomer($rootScope, $modalService, $customerService, $paymentService){
  return{
    restrict: 'EA',
    link: function($scope, element, attrs) {
      $scope.$watch(function() {
				$scope.custId = $scope.$eval(attrs.custId);
			})

      $scope.modalName = "List Customer";
      
      $scope.modalHeadings = [
        {name: "ID Customer"},
        {name: "Nama Customer"},
        {name: "Alamat"}
      ]
      
      $scope.modalCols = ['id', 'name', 'npwp'];
      $scope.modalTableType = 'non-edited-table';

      element.bind('click', function(){
        $scope.requiredData = {
          limit: 10,
          offset: 0,
          id: '',
          name: ''
        }

        var modalOptions = {
          scope: $scope,
          templateUrl: '/dist/view/modal/supplierList.html',
          size: 'lg'
        }
        
        setTimeout(() => {$(".form-input:eq(1)").focus();}, 90);
        
        $modalService.open(modalOptions)
        .then(function(response) {
          console.log('aa');
                    
          $scope.searchFilters = [
            {by: "name", name: "Nama Customer", placeholder: "Masukkan Nama Customer"},
            {by: "id", name: "ID Customer", placeholder: "Masukkan ID Customer"}
          ];

          $scope.selectedFilter = {
             item: $scope.searchFilters[0]
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
            getCustomerList($scope.requiredData);
          }

          getCustomerList($scope.requiredData);

          
          $scope.$on("openDetailDataInTable", function(event, args){
            var customer = args.state.data;
            $modalService.close();
            $scope.$broadcast("chooseCustomer", { state: { customer } });
          })

        })

        function getCustomerList(data){
           $customerService.get.customerList(data).then(function(response){
              console.log(response);
              $scope.listModalData = response.result.data;
              $scope.totalRows = response.result.row;
              $scope.$apply();
           })
           .catch(function(error){
              console.log(error);
           })
        }
      })

    }
  }

}
