distributionApp
	.controller('financeController', financeController);

function financeController($scope, $rootScope, $timeout, $window) {
	'use strict';

	setTimeout(function() {
		$rootScope.$broadcast('requestToggleMenu');
	});

	$scope.tileList = [
		{ name: 'Master Bank', icon: 'fa fa-university', link: '/finance/bankmaster', show: $rootScope.accessModules.finance.bank },
		{ name: 'Pelunasan Piutang', icon: 'hsc hsc-pembayaran', link: '/finance/payment', show: $rootScope.accessModules.finance.pay_so },
		{ name: 'Pelunasan Hutang', icon: 'hsc hsc-pembayaran', link: '/finance/popayment', show: $rootScope.accessModules.finance.pay_po },
		{ name: 'Pelunasan PPN Customer', icon: 'hsc hsc-pencairan', link: '/finance/pelunasanppn', show: true},
		{ name: 'Pelunasan PPN Supplier', icon: 'hsc hsc-pencairan', link: '/finance/pelunasanppnsupplier', show: true},
		{ name: 'E-Faktur', icon: 'hsc hsc-efaktur', link: '/finance/einvoice', show: $rootScope.accessModules.finance.e_faktur},
		{ name: 'Penagihan', icon: 'hsc hsc-penagihan', link: '/finance/billing', show: $rootScope.accessModules.finance.billing },
		{ name: 'Cetak Faktur', icon: 'hsc hsc-buatfaktur', link: '/finance/printinvoice', show: $rootScope.accessModules.finance.create_invoice },
		{ name: 'Pencairan Cek/Giro', icon: 'hsc hsc-pencairan', link: '/finance/disbursement', show: $rootScope.accessModules.finance.cek_giro },
		{ name: 'Kas Keluar', icon: 'hsc hsc-kaskeluar', link: '/finance/cashout', show: $rootScope.accessModules.finance.cash_out },
		{ name: 'Kas Masuk', icon: 'hsc hsc-kaskeluar', link: '/finance/cashin', show: $rootScope.accessModules.finance.cash_in },
		{ name: 'Mutasi Bank', icon: 'hsc hsc-kaskeluar', link: '/finance/bankmutation', show: true },
		{ name: 'Master Nomor Seri Pajak', icon: 'hsc hsc-seripajak', link: '/finance/taxserialmaster', show: $rootScope.accessModules.finance.tax_series },
	];
}
