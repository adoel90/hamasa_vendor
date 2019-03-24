distributionApp.directive('showInvoiceDetail', showInvoiceDetail);
function showInvoiceDetail($rootScope, $modalService, $invoiceService, $myCookies){
  return{
    restrict: 'EA',
    scope: {
      invoiceId: '=',
      change: '='
    },
    link: function($scope, element, attrs) {
      $scope.$watch("invoiceId", function (newValue, oldValue, scope) {
        $scope.invoiceId = newValue;
      })
      $scope.$watch("change", function (newValue, oldValue, scope) {
        $scope.change = newValue;
      })
      element.bind("click", function(){
        
        var modalOptions = {
    			scope: $scope,
    			templateUrl: '/dist/view/modal/invoiceDetail.html',
    			size: 'lg'
    		}

        $scope.invToEdit = {
          inv_id: null,
          inv_date: null,
          inv_tax: null,
          tax_static: null,
          tax_dynamic: null
        }

    		$modalService.open(modalOptions)
    		.then(function(response) {
          $scope.onEdit = false;
          var invoice = {
            id: $scope.invoiceId,
            change: $scope.change
          }

          setTimeout (() => { getInvoiceDetail(); }, 100);

          function getInvoiceDetail() {
  					$invoiceService.get.invoiceDetail(invoice).then(function(response) {
              console.log(response);
							$scope.invoiceDetail = response.result;
              $scope.invoiceDetail.before_tax = $rootScope.roundToTwoDecimalPlaces($scope.invoiceDetail.before_tax);
              $scope.invoiceDetail.ppn = $rootScope.roundToTwoDecimalPlaces($scope.invoiceDetail.ppn);
              $scope.invoiceDetail.headings = [
                { name: 'No.', size: 'sm' },
    						{ name: 'Nama Barang' },
    						{ name: 'Kuantitas' },
    						{ name: 'Harga Satuan' },
    						{ name: 'Harga Jual/Penggantian/Uang Muka/Termin' }
              ]
							$scope.$apply();
						})
            .catch(error => {
              $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
            })
  				}

          $scope.printInvoice = function(invoiceDetail){
  					$invoiceService.get.printInvoice(invoiceDetail).then(response => {
  						location.href = api.url + "invoice/print?accessToken=" + $myCookies.get('accessToken') + "&id=" + invoiceDetail.id + "&change=" + invoiceDetail.change;
  					})
  					.catch(error => {
  						$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
  					})
          }
          
          $scope.editInvoice = function(invoiceId){
            $scope.onEdit = true;
            
              $(".default-modal-content").scrollTop(0);
            
            $invoiceService.get.invoiceTax(invoiceId).then(response => {
              console.log(response);
              $scope.invToEdit.tax_front = response.result.tax_static.substring(0, 3);
              $scope.invToEdit.tax_after_front = response.result.tax_static.substring(4,7);
              $scope.invToEdit.tax_middle1 = response.result.tax_static.substring(8, 10);
              $scope.invToEdit.tax_middle2 = response.result.tax_static.substring(11, 14);
              $scope.invToEdit.tax_dynamic = response.result.tax_dynamic;
              $scope.invToEdit.inv_date = response.result.inv_date;
              $scope.invToEdit.new_inv_id = invoiceId;
              $scope.invToEdit.old_inv_id = invoiceId;
              $scope.$apply();
            })
            .catch(error => {
              $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
            })
          }

          $scope.saveInvoice = function(invoiceToEdit){
            $scope.onEdit = false;
            $scope.invToEdit.inv_tax = $scope.invToEdit.tax_front + "." + $scope.invToEdit.tax_after_front + "-" + $scope.invToEdit.tax_middle1 + "." + $scope.invToEdit.tax_middle2 + "" + $scope.invToEdit.tax_dynamic;
            var splitDate = $scope.invToEdit.inv_date.split("-");
            var year = splitDate[0].substring(2,4); var month = splitDate[1]; var date = splitDate[2];
            
            var splitInvoiceId = invoiceToEdit.new_inv_id.split("/");
            var newInvoiceId = year + "/" + month + "/" + date + "/" + splitInvoiceId[3];
            
            $scope.invToEdit.new_inv_id = newInvoiceId;
            console.log($scope.invToEdit);
            $invoiceService.put.updateInvoice($scope.invToEdit).then(response => {
              $rootScope.triggerModal("Invoice berhasil diupdate", "Success", "success", "");
              $scope.$apply();
            })
            .catch(error => {
              $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
            })
          }

          $scope.cancelEditInvoice = function(){
            $scope.onEdit = false;
          }
        })

      });
    }
  }
}
