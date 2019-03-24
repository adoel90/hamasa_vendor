distributionApp.controller('tipoController', function($scope, $rootScope, $tipoService, $timeout, $window, $myCookies) {

	'use strict';
	var accessToken = $myCookies.get("accessToken");
	$scope.requiredData = {
		limit: 10,
		offset: 0,
		id: '',
		date: '',
		customer: '',
		s_date: '',
		e_date: ''
	}

	$scope.searchFilters = [
		{ by: 'id', name: 'No. TIPO', placeholder: 'Masukkan Nomor TIPO' },
		{ by: 'date', name: 'Tanggal', placeholder: 'Masukkan tanggal' },
		{ by: 'customer', name: 'Nama Customer', placeholder: 'Masukkan nama customer' },
		{ by: 'range_date', name: 'Range Tanggal'}
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}

	$scope.headings = [
		{ name: 'No. TIPO', size: 'sm' },
		{ name: 'Tanggal' },
		{ name: 'Customer' }
	]

	$scope.cols = ['id', 'date', 'custName'];
	$scope.btnName = null;
	$scope.tableType = 'non-edited-table';

	$scope.exportToExcel = function(){
		location.href = api.url + "report/original/tipo?accessToken=" + accessToken + '&id=' + $scope.requiredData.id + '&date=' + $scope.requiredData.date + '&customer=' + $scope.requiredData.customer + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date + "&export=" + true;
	}

	$scope.$on("openDetailDataInTable", function(event, args){
		var tipoId = args.state.data.id;
		location.href = '/sales/tipo/tipoinfo/' + tipoId;
	})

	$scope.init = function() {
		getTipoList();
	}

	$scope.doSearchFilter = function(val, type) {
		switch(type) {
			case 'id': {
				$scope.tipo.requiredData.id = val;
				$scope.tipo.requiredData.date = '';
				$scope.tipo.requiredData.customer = '';
				$scope.tipo.requiredData.s_date = '';
				$scope.tipo.requiredData.e_date = '';
				break;
			}
			case 'date': {
				$scope.tipo.requiredData.id = '';
				$scope.tipo.requiredData.date = date;
				$scope.tipo.requiredData.customer = '';
				$scope.tipo.requiredData.s_date = '';
				$scope.tipo.requiredData.e_date = '';
				break;
			}
			case 'customer': {
				$scope.tipo.requiredData.id = '';
				$scope.tipo.requiredData.date = '';
				$scope.tipo.requiredData.customer = date;
				$scope.tipo.requiredData.s_date = '';
				$scope.tipo.requiredData.e_date = '';
				break;
			}
		}
		getTipoList();
	}

	$timeout($scope.init, 100);

	function getTipoList() {
		$tipoService.get.tipoList($scope.requiredData)
		.then(function(response) {
			for(var i=0; i < response.result.data.length; i++){
				response.result.data[i].custName = response.result.data[i].customer.name;
			}
			$scope.listData = response.result.data;
			$scope.totalRows = response.result.row;
			$scope.$apply();
		})
		.catch(error => {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

	$scope.$on('requestFetchData', function() {
		$scope.init();
	});

});
