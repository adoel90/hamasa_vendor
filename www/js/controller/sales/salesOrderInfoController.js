distributionApp.controller('salesOrderInfoController', function($scope, $rootScope,
	$salesService, $invoiceService, $doService, $modalService, $timeout, $window, $myCookies, $deliveryService) {

	'use strict';

	var selectedId = routeParams.id;
	var accessToken = $myCookies.get("accessToken");

	$rootScope.soId = encodeURIComponent(routeParams.id);

	$scope.init = function() {
		getSalesOrderInfo();
	}

	$scope.redirectToCreateNewDo = function(){
		var urlCreateNewDo = "/sales/salesorder/salesorderinfo/" + encodeURIComponent(routeParams.id) +"/createnewdeliveryorder";
		location.href = urlCreateNewDo;
	}
	
	$scope.openDeliveryDetailInvoice = function(deliveryId){
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/salesDeliveryInvoice.html',
			size: 'lg'
		}

		$modalService.open(modalOptions)
			.then(function(response) {

				$deliveryService.get.deliveryDetailInvoice(deliveryId).then(response => {
					console.log(response);
					$scope.deliveryDetail = response.result;
					$scope.deliveryDetail.headings = [
						{name: "Serial"},
						{name: "Kategori"},
						{name: "Nama"},
						{name: "Grade"},
						{name: "Quantity"},
					];
					$scope.$apply();
				})
				.catch(error => {
					$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
				})

				$scope.printDelivery = function(deliveryId){
					location.href = api.url + "sales/order/delivery/print?accessToken=" + accessToken + "&id=" + deliveryId;
				}
				$scope.printDeliveryInvoice = function(deliveryId){
					location.href = api.url + 'sales/order/delivery/print/invoice?accessToken=' + accessToken + '&id=' + deliveryId;
				}
			})
	}

	$scope.cancelSalesOrder = function() {
		var modalOptions = {
			scope: $scope
		}
		$rootScope.deleteConfirmationModal("Apakah Anda yakin ingin membatalkan Sales Order ini?", "Ya", "Tidak", function(){
			var deleteData = {
				id: selectedId
			}

			$salesService.delete.cancelSalesOrder(deleteData)
			.then(function(response) {
				var urlSucceed = "/sales/salesorder/salesorderinfo/"+encodeURIComponent(routeParams.id);
				$rootScope.triggerModal("Harap Otorisasi Pimpinan", "Success", "success", urlSucceed);
			})
			.catch(function(error) {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
		})

	}

	// 0 = abu2: open
	// -1 = merah: canceled
	// 1 = kuning: aktif
	// 2 = ijo: done
	// 3 = oren : retur
	$scope.getDOStatus = function(status) {
		switch(status) {
			case 0: {
				return 'tile--muted'
				break;
			}
			case -1: {
				return 'tile--danger'
				break;
			}
			case 1: {
				return 'tile--active'
				break;
			}
			case 2: {
				return 'tile--completed'
				break;
			}
			case 3: {
				return 'tile--secondary'
				break;
			}
		}
	}

	$timeout($scope.init, 150);

	function getSalesOrderInfo() {
		$salesService.get.salesOrderInfo(selectedId)
			.then(function(response) {
				console.log(response);
				$scope.salesOrderInfo = response.result;
				for(var i=0; i < $scope.salesOrderInfo.invoice.length; i++){
					$scope.salesOrderInfo.invoice[i].totalInvoice = parseInt($scope.salesOrderInfo.invoice[i].total) + parseInt($scope.salesOrderInfo.invoice[i].stamp);
				}
				$scope.$apply();
			})
			.catch(function(error) {
				console.warn(error);
			})
	}
	
});
