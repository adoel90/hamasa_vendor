distributionApp.controller('itemMasterController', function($scope, $rootScope,
	$itemService, $modalService, $window, $myCookies) {
	//	Table Headings

	var accessToken = $myCookies.get('accessToken');

	$scope.firstSearchVal = "";
	$scope.secondSearchVal = "";

	$scope.headings = [
		{ name: 'Kode Barang' },
		{ name: 'No. Seri' },
		{ name: 'Nama Barang', size: 'lg' },
		{ name: 'Kode Kategori' },
		{ name: 'Kategori' },
		{ name: 'Satuan' },
		{ name: 'Berat' },
		{ name: 'Grade' },
		{ name: 'Stock Lock' },
		{ name: 'Action' }
	];


	$scope.requiredData = {
		limit: 10,
		offset: 0,
		id: '',
		name: '',
		category: '',
		supplier: '',
		grade: ''
	}

	$scope.init = function() {
		$itemService.get.itemList($scope.requiredData).then(function(response) {
			console.log(response.result);
			$scope.totalRows = response.result.row;
			$scope.masterItems = response.result.data;

			$scope.$apply();
		});
	}

	$scope.doCopyItemMaster = function(itemData){
		$myCookies.putObject('itemMaster', itemData);
		$rootScope.triggerModal("Item has been copied", "Success", "success", "");
	}

	$scope.exportCoilTemplate = function(){
		location.href = api.url + "item/coil/template?accessToken=" + accessToken;
	}

	$("#fileUpload").change(function(e){
		 // console.log(e.target.files[0]);
		 var file = e.target.files[0];
		 $scope.importCoil(file);
	})

	$scope.importCoil = function(data){
		 $itemService.post.importCoil(data)
		 .then(function(response){
			 console.log(response);
			 $rootScope.triggerModal("Import coil berhasil", "Success", "success", "/inventory/itemmaster");
		 })
		 .catch(function(error){
			 console.log(error);
			 $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
		 })
	}

	$scope.openItemDetail = function(id) {
		$itemService.get.itemDetail(id)
			.then(function(response) {
				$scope.itemDetail = response.result;
				$scope.itemDetail.headings = {
					warehouse: [
						{ name: 'Nama Gudang' },
						{ name: 'Stok Planing' },
						{ name: 'Stok Aktual' },
						{ name: 'Stok Maksimum' },
						{ name: 'Stok Minimum' }
					],
					opname: [
						{ name: 'Nama Gudang' },
						{ name: 'Tanggal' },
						{ name: 'Keterangan', size: 'lg' }
					]

				}

				var options = {
					templateUrl: '/dist/view/modal/itemMasterDetail.html',
					size: 'lg',
					scope: $scope
				}

				$modalService.open(options);

				$scope.deleteItem = function() {
					$rootScope.deleteConfirmationModal("Anda yakin ingin menghapus barang ini?", "Hapus", "Batal", function(){
						var deleteData = {
							ig_id: $scope.itemDetail.ig_id
						}
						$itemService.delete.deleteItem(deleteData)
						.then(function(response) {
							$rootScope.triggerModal("Item telah dihapus", "Success", "success", "/inventory/itemmaster");
						})
						.catch(function(error) {
							$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
						})
					});
				}
			})
	}

	$scope.$on('initDataByFilter', function(event, args) {
		$scope.requiredData.offset = 0;
		$scope.init();
	});

	$scope.$on('requestFetchData', function(event, args) {
		$scope.init();
	});

	setTimeout(function() {
		$scope.$broadcast('requestFetchData');
	}, 100);

	$scope.exportToExcel = function(){
		location.href = api.url + "report/inventory/item/list?accessToken=" + accessToken + "&export=" + true + "&name=" + $scope.requiredData.name + "&category=" + $scope.requiredData.category + "&supplier=" + $scope.requiredData.supplier + "&id=" + $scope.requiredData.id + "&grade=" + $scope.requiredData.grade;
	}

});
