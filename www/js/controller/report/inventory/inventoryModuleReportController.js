distributionApp.controller('inventoryModuleReportController', function($scope, $rootScope){
  $scope.submoduleList = [
    {name: "Laporan Stok Gudang", link: "/inventoryreport/warehousestock"},
    {name: "Laporan Aktivitas Barang", link: "/inventoryreport/warehouseactivity"},
    {name: "Laporan Mutasi Gudang", link: "/inventoryreport/warehousemutation"}
    // {name: "Laporan Stok Minus", link: "/inventoryreport/warehousestockminus"},
  ];

  setTimeout(function() {
		$rootScope.$broadcast('requestToggleMenu');
	});
})
