distributionApp.directive('showSoDetail', showSoDetail);
function showSoDetail($rootScope, $modalService, $salesService, $myCookies, $invoiceService){
  return{
    restrict: 'EA',
    scope: {
      soId: '=',
      purpose: '=',
      soAuthStatus: '='
    },
    link: function($scope, element, attrs) {
      $scope.$watch('soId', function (newValue, oldValue, scope) {
        $scope.soId = newValue;
      })
      $scope.$watch('purpose', function (newValue, oldValue, scope) {
        $scope.purpose = newValue;
      })

      $scope.$watch('soAuthStatus', function (newValue, oldValue, scope) {
        $scope.soAuthStatus = newValue;
      })
      element.bind("click", function(){
        var modalOptions = {
          scope: $scope,
          templateUrl: '/dist/view/modal/salesOrderDetail.html',
          size: 'lg'
        }

    		$modalService.open(modalOptions)
    		.then(function(response) {
          if($scope.purpose == 'Cut Cost Detail'){

            $salesService.get.salesOrderCutDetail($scope.soId).then(response => {
              $scope.salesOrderDetail = response.result;
              console.log(response);
              $scope.salesOrderDetail.headings = [
                {name: "Kategori"},
                {name: "Nama Barang"},
                {name: "Satuan"},
                {name: "Grade"},
                {name: "Jumlah"},
                {name: "Gudang"},
                {name: "Keterangan"},
                {name: "Harga Potong"}
              ]
              setTimeout(() => { mappingIntoSoDetailFields($scope.salesOrderDetail); }, 150);
      			})
      			.catch(error => {
      				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      			})
          }
          else{
            $salesService.get.salesOrderDetail($scope.soId)
						.then(function(response) {
              console.log(response);
							$scope.salesOrderDetail = response.result;
              $scope.salesOrderDetail.headings = [
                { name: 'Kategori' },
    						{ name: 'Nama Barang'},
    						{ name: 'Satuan' },
    						{ name: 'Grade' },
    						{ name: 'Harga Jual' },
    						{ name: 'Jumlah' },
    						{ name: 'Gudang' },
    						{ name: 'Keterangan'}
              ]
              setTimeout(() => { mappingIntoSoDetailFields($scope.salesOrderDetail); }, 150);
						})
						.catch(function(error) {
							console.log(error);
              $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
						})
          }

          function mappingIntoSoDetailFields(soDetail){
            $scope.listFieldsInTheLeft = [
              {name: "Nomor SO", value: soDetail.id, type: "text"},
              {name: "Tanggal SO", value: soDetail.date, type: "text"},
              {name: "Status SO", value: soDetail.status.name, type: "text"}
            ];

            $scope.listFieldsInTheRight = [
              {name: "ID Customer", value: soDetail.customer.id, type: "text"},
              {name: "Nama Customer", value: soDetail.customer.name_on_so, type: "text"},
              {name: "NPWP Customer", value: soDetail.customer.npwp, type: "text"},
              {name: "Alamat Customer", value: soDetail.customer.address_on_so, type: "text"}
            ];
            $scope.$apply();
          }

          $scope.printSo = function(id){
            console.log($scope.purpose);
            console.log(id);
            if($scope.purpose == 'Cut Cost Detail') location.href = api.url + "sales/order/cut/print?accessToken=" + $myCookies.get('accessToken') + "&id=" + id;
            else if($scope.purpose == 'SO Detail') location.href = api.url + "sales/order/print?accessToken=" + $myCookies.get('accessToken') + "&id=" + id;            
          }

          $scope.fixCustomerData = function(soDetail){
            console.log('fix data customer');
            console.log('soId',soDetail.id);
            var data = {
              so_id: soDetail.id
            }
            var andSeparator = "";
            var updateConfirmation = "Apakah Anda yakin ingin mengubah ";
            if( (soDetail.customer.name_on_so !== soDetail.customer.name) && (soDetail.customer.address_on_so !== soDetail.customer.address)){
              andSeparator = " dan ";
            }
            if(soDetail.customer.name_on_so !== soDetail.customer.name){
              updateConfirmation = updateConfirmation + "nama " + soDetail.customer.name_on_so + " menjadi " + soDetail.customer.name + andSeparator;
            }
            if(soDetail.customer.address_on_so !== soDetail.customer.address){
              updateConfirmation = updateConfirmation + " alamat " + soDetail.customer.address_on_so + " menjadi " + soDetail.customer.address;              
            }
            updateConfirmation = updateConfirmation + " ?";

            $rootScope.deleteConfirmationModal(updateConfirmation, "Ya", "Tidak", function(){
              $invoiceService.put.generateInvoiceReplacement(data).then(response => {    
                $rootScope.triggerModal("Data Customer untuk SO ini telah diperbaiki", "Success", "success", "");
              })
              .catch(error => {
                console.log(error);
                $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
              })    
            })
            
          }
        });
      })
    }
  }
}
