distributionApp.controller('customerMasterController', function($scope, $rootScope,
	$customerService, $modalService, $window, $timeout, $myCookies) {

	var accessToken = $myCookies.get("accessToken");
	//	Table Headings
	$scope.headings = [
		{ name: 'ID Customer' },
		{ name: 'Nama Customer' },
		{ name: 'Alamat', size: 'lg' },
		{ name: 'Kota' },
		{ name: 'Action'}
	];

	$scope.searchFilters = [
		{ by: 'name', name: 'Nama Customer', placeholder: 'Masukkan nama customer' },
		{ by: 'id', name: 'ID Customer', placeholder: 'Masukkan ID customer' }
	];

	$scope.selectedFilter = {
		item: $scope.searchFilters[0]
	}

	$scope.requiredData = {
		limit: 10,
		offset: 0,
		id: '',
		name: ''
	}

	$scope.cols = ['id', 'name', 'custAddress', 'custCity'];
  	$scope.btnName = "Tambah Customer";
  	$scope.tableType = 'master-table';

	$scope.init = function() {
		getCustomerList();
	}

	$scope.doSearchFilter = function(val, type) {
		$scope.requiredData.offset = 0;
		switch(type) {
			case 'id': {
				$scope.requiredData.id = val;
				$scope.requiredData.name = '';
				break;
			}
			case 'name': {
				$scope.requiredData.name = val;
				$scope.requiredData.id = '';
				break;
			}
		}

		$scope.init();
	}

	$scope.redirectToCreateNewData = function(){
    	location.href = '/sales/customermaster/createnewcustomer';
  	}

  	$scope.printCustomerMasterReport = function(){
		location.href= api.url + "report/original/customer/master?accessToken=" + accessToken + "&export=" + true;
	}

	$scope.editData = function(content){
		var customerId = content.id;
		location.href = '/sales/customermaster/editcustomer/' + customerId;
  	}

	$scope.openDetailData = function(content){
		var custId = content.id;
		$customerService.get.customerDetail(custId)
		.then(function(response) {
				console.log(response);
				$scope.address = {
					headings: [
						{ name: 'Alamat', size: 'lg' },
						{ name: 'Provinsi'},
						{ name: 'Kota' },
						{ name: 'Kecamatan'},
						{ name: 'Kelurahan'},
						{	name: 'Kode Pos'}
					]
				}
				$scope.contact = {
					headings: [
						{ name: 'Phone' },
						{ name: 'Contact Person'}
					]
				}
				$scope.customerDetail = response.result;
				$scope.customerDetail.credit.limit = $rootScope.numberWithCommas($scope.customerDetail.credit.limit);
				var modalOptions = {
					scope: $scope,
					templateUrl: '/dist/view/modal/customerDetail.html',
					size: 'lg'
				}
				$modalService.open(modalOptions);
			})
		.catch(function(error) {
			console.warn(error)
		});
	}

	$scope.deleteData = function(content){
		var customerId = content.id;
		$rootScope.deleteConfirmationModal("Apakah Anda yakin untuk menghapus customer ini?", "Hapus", "Batal", function (){
			var customerData = {
				id: customerId
			}
			$customerService.delete.deleteCustomer(customerData)
			.then(function(response) {
				$rootScope.triggerModal("Customer telah dihapus!", "Success", "success", "/sales/customermaster");
			})
			.catch(function(error) {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			});
		});
	}

	$scope.$on('requestFetchData', function() {
		$scope.init();
	});

	setTimeout(function() { $scope.init(); }, 150)

	function getCustomerList() {
		$customerService.get.customerList($scope.requiredData).then(function(response) {
			console.log(response);
			for(var i=0; i < response.result.data.length; i++){
				response.result.data[i].custAddress = response.result.data[i].address.length > 0 ?  response.result.data[i].address[0].address : '-';
				response.result.data[i].custCity = ( (response.result.data[i].address.length > 0) && (response.result.data[i].address[0].city) ) ? response.result.data[i].address[0].city.name : '-';
				response.result.data[i].custCP = response.result.data[i].phone.length > 0 ? response.result.data[i].phone[0].contact_person : '-';
			}
			$scope.listData = response.result.data;
			$scope.totalRows = response.result.row;
			$scope.$apply();
		})
		.catch(function(error) {
			$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		})
	}
})
