distributionApp.controller('financeModuleReportController', function($scope, $rootScope){
  $scope.submoduleList = [
    {name: "Laporan Penerimaan Kas", link: "/financereport/income"},
    {name: "Laporan Piutang Customer", link: "/financereport/piutangcustomer"},
    {name: "Laporan Aging Piutang", link: "/financereport/agingpiutang"},
    // {name: "Laporan Piutang Customer", link: "/financereport/customercredit"},
    // {name: "Analisa Umur Piutang Customer", link: "/financereport/customercreditanalysis"},
    {name: "Laporan Pencairan Cek / Giro", link: "/financereport/paymentdisbursement"},
    {name: "Laporan Jatuh Tempo Cek / Grio", link: "/financereport/giroduedate"},
    {name: "Laporan Pelunasan Piutang Harian", link: "/financereport/accountreceivablesdailyreport"},
    {name: "Laporan Hutang", link: "/financereport/debtreport"}
  ];

  setTimeout(function() {
		$rootScope.$broadcast('requestToggleMenu');
	});
})
