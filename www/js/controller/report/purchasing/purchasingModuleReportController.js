distributionApp.controller('purchasingModuleReportController', function($scope, $rootScope){
  $scope.submoduleList = [
    {name: "Laporan Pembelian", link: "/purchasingreport/purchase"},
    {name: "Laporan Lengkap Pembelian", link: "/purchasingreport/allpurchasingreport"},
    {name: "Laporan Reorder Gudang", link: "/purchasingreport/warehousereorder"},
    {name: "Laporan Kontrak Pembelian", link: "/purchasingreport/purchasecontract"}
    // {name: "Laporan Kontrak Pembelian", link: "/purchasingreport/purchasingcontract"},
    
  ];

  setTimeout(function() {
		$rootScope.$broadcast('requestToggleMenu');
	});
})
