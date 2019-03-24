distributionApp.controller('salesModuleReportController', function($scope, $rootScope){
  $scope.submoduleList = [
    {name: "Laporan Penjualan Per Hari", link: "/salesreport/selling"},
    {name: "Laporan SO", link: "/salesreport/so"},
    {name: "Laporan Saldo Cutomer", link: "/salesreport/customersaldo"}
    // {name: "Laporan DO Outstanding", link: "/salesreport/dooutstanding"},
    // {name: "Laporan Faktur Kredit", link: "/salesreport/creditinvoice"},
    // {name: "Laporan Penawaran Harian", link: "/salesreport/quotation"}, 
    // {name: "Laporan Stok Terjual", link: "/salesreport/itemsold"}
  ];

  setTimeout(function() {
		$rootScope.$broadcast('requestToggleMenu');
	});
})
