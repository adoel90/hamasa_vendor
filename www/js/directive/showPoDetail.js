distributionApp.directive('showPoDetail', showPoDetail);
function showPoDetail($rootScope, $purchaseService, $modalService){
  return{
    restrict: 'EA',
    scope:{
      poId: '='
    },
    link: function($scope, element, attrs) {

      element.bind("click", function(){

        $scope.$watch('poId', function (newValue, oldValue, scope) {
          $scope.poId = newValue;
        })

        var modalOptions = {
    			scope: $scope,
    			templateUrl: '/dist/view/modal/detailPo.html',
    			size: 'lg'
  		  }

        $modalService.open(modalOptions)
  			.then(function(response) {
          $scope.detailPo = {
             headings: [
                {name: "Kategori"},
                {name: "Nama Barang"},
                {name: "Satuan"},
                {name: "Grade"},
                {name: "Jumlah Pesan"},
                {name: "Jumlah Outstanding"},
                {name: "Harga"}
             ],
             data: {}
          }
          $purchaseService.order.get.purchaseOrderDetail($scope.poId).then(function(response){
             console.log(response);
             $scope.detailPo.data = response.result;
             $scope.$apply();
          })
          .catch(function(error){
             $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
          })
        })

      })
    }
  }
}
