distributionApp.controller('quotationController', function($scope, $rootScope,
	$quotationService, $modalService, $window, $timeout, $myCookies) {

	'use strict';

	var accessToken = $myCookies.get('accessToken');
	$scope.requiredData = {
		limit: 10,
		offset: 0,
		id: '',
		date: '',
		customer_name: '',
		s_date: '',
		e_date: ''
	}

	$scope.searchFilters = [
		{ by: 'id', name: 'ID Penawaran', placeholder: 'Masukkan ID Penawaran' },
		{ by: 'date', name: 'Tanggal Penawaran', placeholder: 'Masukkan Tanggal Penawaran' },
		{ by: 'customer_name', name: 'Nama Customer', placeholder: 'Masukkan Nama Customer' },
		{ by: 'range_date', name: 'Range Tanggal', placeholder: ''}
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}

	$scope.headings = [
		{ name: 'No. Penawaran' },
		{ name: 'Tanggal' },
		{ name: 'Realisasi SO' },
		{ name: 'Nama Customer' },
		{ name: 'Sales' },
	]

	$scope.cols = ['id', 'date', 'so_id', 'custName', 'salesName'];
  	$scope.btnName = "Buat Penawaran";
  	$scope.tableType = 'non-edited-table';

	$scope.redirectToCreateNewData = function(){
    	location.href = '/sales/quotation/createnewquotation';
  	}

	$scope.printQuotation = function(quotationId){
		location.href = api.url + "quotation/print?accessToken=" + accessToken +"&id=" +quotationId;
	}

	$scope.exportToExcel = function(){
		location.href = api.url + 'report/original/quotation?accessToken=' + accessToken + '&export=' + true + '&id=' + $scope.requiredData.id + '&date=' + $scope.requiredData.date + '&customer_name=' + $scope.requiredData.customer_name + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date;
	}

	$scope.doSearchFilter = function(val, type) {
		switch(type) {
			case 'id': {
				$scope.requiredData.id = val;
				$scope.requiredData.date = '';
				$scope.requiredData.customer_name = '';
				$scope.requiredData.s_date = '';
				$scope.requiredData.e_date = '';
				break;
			}
			case 'date': {
				$scope.requiredData.id = '';
				$scope.requiredData.date = val;
				$scope.requiredData.customer_name = '';
				$scope.requiredData.s_date = '';
				$scope.requiredData.e_date = '';
				break;
			}
			case 'customer_name': {
				$scope.requiredData.id = '';
				$scope.requiredData.date = '';
				$scope.requiredData.customer_name = val;
				$scope.requiredData.s_date = '';
				$scope.requiredData.e_date = '';
				break;
			}
		}

		$scope.init();
	}

	$scope.$on("openDetailDataInTable", function(event, args){
		var quotationId = args.state.data.id;
		var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/quotationDetail.html',
			size: 'lg'
		}

		$modalService.open(modalOptions);

		$scope.modalInit = function() {
			getQuotationDetail();
		}

		$scope.realizeQuotation = function() {
			var requiredData = {
				id: quotationId
			}

			$quotationService.post.realizeQuotation(requiredData)
				.then(function(response) {
					$rootScope.triggerModal("Penawaran ini telah berhasil direalisasikan.", "Success", "success", "/sales/quotation");
				})
				.catch(function(error) {
					$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
				})
		}

		$timeout($scope.modalInit, 50);

		function getQuotationDetail() {
			$quotationService.get.quotationDetail(quotationId)
			.then(function(response) {
				console.log(response);
				for(var i=0; i < response.result.item.length; i++){
					response.result.item[i].categoryName = response.result.item[i].category.name;
				}
				$scope.quotationDetail = response.result;

				$scope.listFieldsInTheLeft = [
					{ name: "Nomor Penawaran", value: response.result.id, type: "text" },
					{ name: "Tanggal Penawaran", value: response.result.date, type: "text" },
					{ name: "ID Customer", value: response.result.customer.id, type: "text" },
					{ name: "Nama Customer", value: response.result.customer.name, type: "text" },
				];

				$scope.listFieldsInTheRight = [
					{ name: "Jenis Pembayaran", value: response.result.pay_method.name, type: "text" },
					{ name: "Jenis Pengambilan", value: response.result.pickup.name, type: "text" },
					{ name: "Realisasi SO", value: response.result.so_id, type: "text" }
				];

				$scope.quotationDetail.headings = [
					{ name: 'Kategori' },
					{ name: 'Nama Barang' },
					{ name: 'Satuan' },
					{ name: 'Grade' },
					{ name: 'Jumlah' },
					{ name: 'Harga (in Rp)' }
				];

				$scope.quotationDetail.cols = [
					{name: "categoryName", type: "text"},
					{name: "name", type: "text"},
					{name: "unit", type: "text"},
					{name: "grade", type: "text"},
					{name: "quantity", type: "number"},
					{name: "price", type: "number"}
				];

				$scope.$apply();
			})
			.catch(function(error) {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
		}
	})

	$scope.init = function() {
		getQuotationList($scope.requiredData);
	}

	$timeout($scope.init, 100);

	$rootScope.$on('requestFetchData', function() {
		$scope.init();
	})

	function getQuotationList(data) {
		$quotationService.get.quotationList(data).then(function(response) {
			console.log(response);
			for(var i=0; i<response.result.data.length; i++){
				response.result.data[i].custName = response.result.data[i].customer.name;
				response.result.data[i].salesName = response.result.data[i].sales.name;
			}
			$scope.listData = response.result.data;
			$scope.totalRows = response.result.row;
			$scope.$apply();
		})
		.catch(function(error) {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}

});
