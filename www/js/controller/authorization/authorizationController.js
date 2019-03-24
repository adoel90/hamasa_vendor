distributionApp.controller('authorizationController', function($rootScope, $scope){
  $scope.tileList = [
    {name: "Penjualan", icon: "hsc hsc-penjualan", link: "/authorization/salesauth", show: $rootScope.accessModules.auth.auth_sales },
    {name: "Pembelian", icon: "hsc hsc-pembelian", link: "/authorization/purchasingauth", show: $rootScope.accessModules.auth.auth_purchase },
    {name: "Inventory", icon: "hsc hsc-gudang", link: "/authorization/inventoryauth", show: $rootScope.accessModules.auth.auth_inventory },
    {name: "Finance", icon: "hsc hsc-finance", link: "/authorization/financeauth", show: $rootScope.accessModules.auth.auth_finance }
  ];

  setTimeout(function() {
		$rootScope.$broadcast('requestToggleMenu');
	});
})
