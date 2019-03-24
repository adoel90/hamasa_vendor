distributionApp.directive('showTipoDetail', showTipoDetail);
function showTipoDetail($rootScope, $modalService, $tipoService){
  return{
    restrict: 'EA',
    scope: {
      tipoId: '='
    },
    link: function($scope, element, attrs) {
      $scope.$watch('tipoId', function (newValue, oldValue, scope) {
        $scope.tipoId = newValue;
        console.log(newValue);
      })
      element.bind('click', function(){
        var modalOptions = {
          scope: $scope,
          templateUrl: '/dist/view/modal/tipoDetail.html',
          size: 'lg'
        }

        $modalService.open(modalOptions)
        .then(function(response) {
          $tipoService.get.detailBtbTipo($scope.tipoId).then(function(response){
            $scope.tipoDetail = response.result;
            $scope.tipoDetail.headings = [
              {name: "Serial"},
              {name: "Kategori"},
              {name: "Nama Barang"},
              {name: "Berat"},
              {name: "Quantity"},
              {name: "Keterangan"}
            ]

            $scope.tipoDetail.cols = [
              {name: "serial", type: "text"},
              {name: "category", type: "text"},
              {name: "name", type: "text"},
              {name: "weight", type: "number"},
              {name: "quantity", type: "number"},
              {name: "note", type: "text"}
            ];

            $scope.$apply();
          })
          .catch(error => {
            console.log(error);
            $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
          })
        });

      });
    }
  }
}
