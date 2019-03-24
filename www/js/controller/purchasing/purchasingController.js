distributionApp.controller('purchasingController', function($rootScope, $scope, $timeout){

 $scope.init = function() {
		console.log("Init Purchasing Controller");
		console.log($rootScope);

	$scope.tileList = [
		{ name: 'Kontrak Pembelian', icon: 'hsc hsc-kontrakpembelian', link: '/purchasing/purchasingcontract', show: $rootScope.accessModules.purchase.purchase_contract },
		{ name: 'PO', icon: 'hsc hsc-po', link: '/purchasing/po', show: $rootScope.accessModules.purchase.po },
		{ name: 'Master Supplier', icon: 'hsc hsc-supplier', link: '/purchasing/supplier', show: $rootScope.accessModules.purchase.supplier },
		{ name: 'PO Invoice', icon: 'fa fa-money', link: '/purchasing/poinvoice', show: $rootScope.accessModules.purchase.po_invoice },
		{ name: 'Bukti Pengambilan Barang', icon: 'fa fa-money', link: '/purchasing/bpb', show: $rootScope.accessModules.purchase.bpb }
		
	]
 }

	$timeout($scope.init, 50);

	setTimeout(function() {
		$rootScope.$broadcast('requestToggleMenu');
	});
})


