distributionApp.controller('salesController', function($scope, $rootScope, $timeout) {
    'use strict';

    $scope.init = function() {
    	$scope.tileList = [
        { name: 'Master Customer', icon: 'hsc hsc-customer', link: '/sales/customermaster', show: $rootScope.accessModules.sales.customer },
        { name: 'Kontrak Penjualan', icon: 'hsc hsc-kontrakpenjualan', link: '/sales/salescontract', show: $rootScope.accessModules.sales.sales_contract },
        { name: 'Penawaran', icon: 'hsc hsc-penawaran', link: '/sales/quotation', show: $rootScope.accessModules.sales.quotation },
        { name: 'Sales Order', icon: 'hsc hsc-penjualan', link: '/sales/salesorder', show: $rootScope.accessModules.sales.so },
        { name: 'TIPO', icon: 'hsc hsc-btbtipo', link: '/sales/tipo', show: $rootScope.accessModules.sales.tipo },
        { name: 'Master Harga Barang', icon: 'hsc hsc-hargabarang', link: '/sales/pricemaster', show: $rootScope.accessModules.sales.price_list },
        { name: 'Master Harga Pengiriman', icon: 'hsc hsc-hargapengiriman', link: '/sales/pricedelivery', show: $rootScope.accessModules.sales.delivery_list },
        { name: 'Pengiriman', icon: 'hsc hsc-pengiriman', link: '/sales/delivery', show: $rootScope.accessModules.sales.delivery },
        { name: 'Pemotongan', icon: 'fa fa-scissors', link: '/sales/cuttingcost', show: $rootScope.accessModules.sales.cut }
    	]
    }

    $timeout($scope.init);

	setTimeout(function() {
		$rootScope.$broadcast('requestToggleMenu');
	});
});
