distributionApp.directive('showBtbHistory', showBtbHistory);
function showBtbHistory($rootScope, $purchaseService, $modalService){
  return{
    restrict: 'EA',
    scope: {
      poId: '='
    },
    link: function($scope, element, attrs) {

      element.bind("click", function(){

        $scope.$watch('poId', function (newValue, oldValue, scope) {
          $scope.poId = newValue;
        })

        var modalOptions = {
          scope: $scope,
          templateUrl: '/dist/view/modal/btbHistory.html',
          size: 'lg'
        }

        setTimeout(() => { getBtbHistory($scope.poId); }, 150);

        function getBtbHistory(poId){
          $purchaseService.order.get.purchaseOrderBtbHistory(poId).then(response => {
            if(response.result.length > 0){
                $scope.btbHistoryList = response.result;
                $modalService.open(modalOptions)
                .then(function(response) {
                  $scope.btbHistoryHeadings = [
                    {name: "Serial"},
                    {name: "Kategori"},
                    {name: "Nama"},
                    {name: "Satuan"},
                    {name: "Berat"},
                    {name: "Qty Terima"}
                  ];
                })
            }
            else{
              $rootScope.triggerModal("Belum ada histori BTB untuk PO ini", "Error", "danger", "");
            }
          })
          .catch(error => {
            $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
          })
        }
      })
    }
  }
}
