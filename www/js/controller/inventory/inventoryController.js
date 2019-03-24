distributionApp.controller('inventoryController', function($scope, $rootScope, $timeout) {
	'use strict';

	$scope.init = function() {
		$scope.tileList = [
			{ name: 'Master Barang', icon: 'hsc hsc-barang', link: '/inventory/itemmaster', show: $rootScope.accessModules.inventory.items },
			{ name: 'Master Gudang', icon: 'hsc hsc-gudang', link: '/inventory/warehousemaster', show: $rootScope.accessModules.inventory.warehouse },
			{ name: 'Master Kategori', icon: 'hsc-inventorigudang', link: '/inventory/categorymaster', show: $rootScope.accessModules.inventory.category },
			{ name: 'Master Grade', icon: 'fa fa-font', link: '/inventory/grademaster', show: $rootScope.accessModules.inventory.grade },
			{ name: 'Mutasi', icon: 'hsc hsc-mutasi', link: '/inventory/mutation', show: $rootScope.accessModules.inventory.mutation },
			{ name: 'Konversi', icon: 'hsc hsc-konversi', link: '/inventory/conversion', show: $rootScope.accessModules.inventory.convertion },
			{ name: 'Terima Barang', icon: 'hsc hsc-terimabarang', link: '/inventory/btb', show: $rootScope.accessModules.inventory.btb },
			{ name: 'Keluar Barang', icon: 'hsc hsc-keluarbarang', link: '/inventory/bkb', show: $rootScope.accessModules.inventory.bkb },
			{ name: 'Inventori Gudang', icon: 'hsc hsc-inventorigudang', link: '/inventory/warehouseinventory', show: $rootScope.accessModules.inventory.inventory },
			{ name: 'Stok Adjustment', icon: 'hsc hsc-adjustmentstock', link: '/inventory/stockadjustment', show: $rootScope.accessModules.inventory.stock_adjust },
			{ name: 'BTB TIPO', icon: 'hsc hsc-terimabarang', link: '/inventory/btbtipo', show: $rootScope.accessModules.inventory.btb_tipo },
			{ name: 'BKB TIPO', icon: 'hsc hsc-keluarbarang', link: '/inventory/bkbtipo', show: $rootScope.accessModules.inventory.bkb_tipo },
			{ name: 'Surat Perintah Kerja', icon: 'hsc hsc-spk', link: '/inventory/spk', show: $rootScope.accessModules.inventory.spk },
		]
	}

	$timeout($scope.init, 50);

	setTimeout(function() {
		$rootScope.$broadcast('requestToggleMenu');
	});
});
