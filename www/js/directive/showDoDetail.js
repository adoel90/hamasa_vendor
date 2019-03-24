distributionApp.directive('showDoDetail', showDoDetail);
function showDoDetail($rootScope, $modalService, $doService, $tipoService, $myCookies){
  return{
    restrict: 'EA',
    scope: {
      doId: '=',
      purpose: '='
    },
    link: function($scope, element, attrs) {
      $scope.$watch("doId", function (newValue, oldValue, scope) {
        $scope.doId = newValue;
      })
      $scope.$watch("purpose", function (newValue, oldValue, scope) {
        $scope.purpose = newValue;
      })

      element.bind("click", function(){
        if($scope.purpose == 'do'){
          $scope.modalName = "Delivery Order";

          var modalOptions = {
            scope: $scope,
            templateUrl: '/dist/view/modal/doDetail.html',
            size: 'lg'
          }

          $modalService.open(modalOptions)
          .then(function(response) {

            setTimeout(() => { getDoDetail($scope.doId) }, 70);

            function getDoDetail(id){
              $doService.get.doDetail(id).then(response => {
                console.log(response);
                for(var i=0; i< response.result.item.length; i++){
                  response.result.item[i].categoryName = response.result.item[i].category.name;
                }
                $scope.doDetail = response.result;
                $scope.doDetailCols = ["serial", "categoryName", "name", "grade", "quantity"];
                $scope.doDetailHeadings = [
                  {name: "Serial"},
                  {name: "Kategori"},
                  {name: "Nama Barang"},
                  {name: "Grade"},
                  {name: "Jumlah Ambil"}
                ];
                mappingIntoDoDetailFields($scope.doDetail);
              })
              .catch(error => {
                $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
              })
            }

            $scope.resumeDo = function(){
              var data = {
                id: $scope.doId
              }
              $doService.post.doResume(data).then(response => {
    						var urlSucceed = "/sales/salesorder/salesorderinfo/" + encodeURIComponent(routeParams.id);
    						$rootScope.triggerModal("Print sisa do berhasil.", "Success", "success", urlSucceed);
    					})
    					.catch(error => {
    						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    					})
            }

            $scope.cancelDo = function(){
    					$rootScope.deleteConfirmationModal("Apakah Anda yakin ingin membatalkan Sales Order ini?", "Iya", "Tidak", function(){
    						var deleteData = {
    							id: $scope.doId
    						}
    						$doService.delete.cancelDo(deleteData).then(response => {
    							var urlSucceed = "/sales/salesorder/salesorderinfo/" + encodeURIComponent(routeParams.id);
    							$rootScope.triggerModal("DO telah dibatalkan", "Success", "success", urlSucceed);
    						})
    						.catch(error => {
    							$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    						})
    					})
    				}

            $scope.printDo = function(){
              $doService.get.validatePrintDo($scope.doId).then(response => {
    						location.href= api.url + "do/print?accessToken=" + $myCookies.get("accessToken") + "&id=" + $scope.doId;
    					})
    					.catch(error => {
    						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    					})
            }

          });
        }
        else if($scope.purpose == 'do tipo'){
          $scope.modalName = "Delivery Order Tipo";
          var modalOptions = {
            scope: $scope,
            templateUrl: '/dist/view/modal/doDetail.html',
            size: 'lg'
          }

          $modalService.open(modalOptions)
          .then(function(response) {
            setTimeout(() => { getDoTipoDetail($scope.doId) }, 70);

            function getDoTipoDetail(id){
              $tipoService.get.doTipoDetail(id).then(response => {
                console.log(response);
                for(var i=0; i< response.result.item.length; i++){
                  response.result.item[i].categoryName = response.result.item[i].category.name;
                }
                $scope.doDetail = response.result;
                $scope.doDetailCols = ["category", "name", "quantity"];
                $scope.doDetailHeadings = [
                  {name: "Kategori"},
                  {name: "Nama Barang"},
                  {name: "Jumlah Ambil"}
                ];
                mappingIntoDoDetailFields($scope.doDetail);
              })
              .catch(error => {
                $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
              })
            }

            $scope.resumeDo = function(){
              var data = {
          			dotipo_id: $scope.doId
          		}
              $tipoService.post.createDoTipoResume(data).then(response => {
          			var succeedUrl = "/sales/tipo/tipoinfo/" + encodeURIComponent(routeParams.id);
          			$rootScope.triggerModal("DO Tipo Resume berhasil dibuat", "", "success", succeedUrl);
          		})
          		.catch(error => {
          			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
          		})
            }

            $scope.printDo = function(){
              location.href = api.url + "tipo/do/print?accessToken=" + $myCookies.get('accessToken') + "&id=" + $scope.doId;
            }

          });
        }

        function mappingIntoDoDetailFields(doDetail){
          $scope.listFieldsInTheLeft = [
            { name: "Nomor DO", value: doDetail.id, type: "text" },
            { name: "Nomor EX DO", value: doDetail.ex_do, type: "text" },
            { name: "Tanggal", value: doDetail.date, type: "text" },
            { name: "Status", value: doDetail.status.name, type: "text" }
          ];

          $scope.listFieldsInTheRight = [
            { name: "ID Customer", value: doDetail.customer.id, type: "text" },
            { name: "Nama Customer", value: doDetail.customer.name_on_so, type: "text" },
            { name: "NPWP Customer", value: doDetail.customer.npwp, type: "text" },
          ];

          $scope.listFieldsInTheLeft2 = [
            { name: "Nama Gudang", value: doDetail.warehouse.name , type: "text"},
            { name: "Nomor BKB", value: doDetail.bkb ? doDetail.bkb.id : '-' , type: "text" }
          ];

          $scope.listFieldsInTheRight2 = [
            { name: "Pengemudi", value: doDetail.bkb ? doDetail.bkb.driver : '-', type: "text"},
            { name: "No Kendaraan", value: doDetail.bkb ? doDetail.bkb.transport_number : '-', type: "text" }
          ];

          $scope.$apply();
        }
      });
    }
  }
}
