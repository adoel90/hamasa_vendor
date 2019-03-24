distributionApp.controller('createNewCustomerController', function($scope, $rootScope,
	$customerService, $regionService, $modalService, $window, $timeout) {

	'use strict';

	//
	$scope.requiredData = {
		type: '',
		name: '',
		npwp: '',
		address: [],
		phone: [
			{ phone: '', contact_person: '' }
		],
		fax: '',
		credit: false,
		credit_limit: '',
		charge_day: [],
		pay_day: [],
		selectedCreditStatus: null,
		selectedCustRegion: null,
		region: null
	}

	$scope.address = {
		address: '',
		province: '',
		city: '',
		district: '',
		urban: '',
		postal_code: '',
		selectedProvice: null,
		selectedCity: null,
		selectedDistrict: null,
		selectedUrban: null,
		listProvince: [],
		listCities: [],
		listDistrict: [],
		listUrban: []
	}

	$scope.listCompanyType = [];
	$scope.listCreditStatus = [
		{name: "Tunai", value: false},
		{name: "Kredit", value: true}
	];
	$scope.listDay = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

	$scope.requiredData.selectedCreditStatus = $scope.listCreditStatus[0];

	$scope.init = function() {
		setDefaultValue_Of_Province_Cites_District_Urban();
		getAllParents();
		getAllCompanyType();
	}

	$timeout($scope.init, 200);

	$scope.changeCreditStatus = function(data){
		$scope.requiredData.credit = data.value;
	}

	$scope.addMoreAddress = function() {
		setDefaultValue_Of_Province_Cites_District_Urban();
		$scope.$apply();
	}

	$scope.addMoreContact = function() {
		if($scope.requiredData.phone.length < 4) {
			var contact = {
				phone: '',
				contact_person: ''
			}

			$scope.requiredData.phone.push(contact);
		}
	}

	$scope.changeProvince = function(province, index){
		$scope.requiredData.address[index].province = province.id;
		$scope.requiredData.address[index].selectedProvince = province;

		getAllCities(province.id, index);
	}

	$scope.changeCity = function(city, index){
		console.log(city.id);
			$scope.requiredData.address[index].city = city.id;
			$scope.requiredData.address[index].selectedCity = city;
			getAllDistrict(city.id, index);
	}

	$scope.validateCity = function(index){
		if($scope.requiredData.address[index].province == null){
			$scope.triggerModal("Provinsi harus dipilih terlebih dahulu", "Error", "danger");
			return;
		}
	}

	$scope.changeDistrict = function(district, index){
		$scope.requiredData.address[index].district = district.id;
		$scope.requiredData.address[index].selectedDistrict = district;
		getAllUrban(district.id, index);
	}

	$scope.validateDistrict = function(index){
		if($scope.requiredData.address[index].city == null){
			$scope.triggerModal("Kota harus dipilih terlebih dahulu", "Error", "danger");
			return;
		}
	}

	$scope.changeUrban = function(urban, index){
		$scope.requiredData.address[index].urban = urban.id;
		$scope.requiredData.address[index].selectedUrban = urban;
	}

	$scope.validateUrban = function(index){
		if($scope.requiredData.address[index].district == null){
			$scope.triggerModal("Kecamatan harus dipilih terlebih dahulu", "Error", "danger");
			return;
		}
	}

	$scope.changeParent = function(parent) {
		$scope.requiredData.parent = parent.id;
		$scope.requiredData.selectedParent = parent;

		console.log($scope.requiredData);
	}

	$scope.changeCompany = function(data){
		if(data.name == '-- Pilih Jenis Perusahaan --'){
			$scope.requiredData.type = null;
			console.log('dia null lho');
		}
		else{
			$scope.requiredData.type = data.name;
		}
	}

	function getAllProvince(){
		$regionService.get.allProvince().then(function(response){

			$scope.address.listProvince = response.result;
			$scope.address.listProvince.splice(0,0, {id: null, name: "-- Pilih Provinsi --"} );
			$scope.address.province = $scope.address.listProvince[0].id;
			$scope.address.selectedProvince = $scope.address.listProvince[0];
			$scope.$apply();

		})
		.catch(function(error){
			console.log(error);
		})
	}

	function setDefaultValueOfCity(){
		$scope.address.listCities = [];
		$scope.address.listCities.push( {id: null, name: "-- Pilih Kota --"} );
		$scope.address.city = $scope.address.listCities[0].id;
		$scope.address.selectedCity = $scope.address.listCities[0];
	}

	function setDefaultValueOfDistrict(){
		$scope.address.listDistrict = [];
		$scope.address.listDistrict.push( {id: null, name: "-- Pilih Kecamatan --"} );
		$scope.address.district = $scope.address.listDistrict[0].id;
		$scope.address.selectedDistrict = $scope.address.listDistrict[0];
	}

	function setDefaultValueOfUrban(){
		$scope.address.listUrban = [];
		$scope.address.listUrban.push( {id: null, name: "-- Pilih Kelurahan --"});
		$scope.address.urban = $scope.address.listUrban[0].id;
		$scope.address.selectedUrban = $scope.address.listUrban[0];
		$scope.requiredData.address.push($scope.address);
		$scope.$apply();
	}

	function setDefaultValue_Of_Province_Cites_District_Urban(){
		$scope.address = {
			address: '',
			province: '',
			city: '',
			district: '',
			urban: '',
			postal_code: '',
			selectedProvice: null,
			selectedCity: null,
			selectedDistrict: null,
			selectedUrban: null,
			listProvince: [],
			listCities: [],
			listDistrict: [],
			listUrban: []
		}
		getAllProvince();
		setDefaultValueOfCity();
		setDefaultValueOfDistrict();

		setTimeout( () => {
			setDefaultValueOfUrban();
		},150);

		$scope.$apply();
	}

	function getAllCities(provinceId, index){
		$regionService.get.allCities(provinceId).then(function(response){
			console.log(response);
			$scope.requiredData.address[index].listCities = response.result;
			$scope.requiredData.address[index].listCities.splice(0,0,{id: null, name: "-- Pilih Kota --"});
			$scope.requiredData.address[index].selectedCity = $scope.requiredData.address[index].listCities[0];
			$scope.requiredData.address[index].city = $scope.requiredData.address[index].listCities[0].id;

			$scope.$apply();
		})
		.catch(function(error){
			console.log(error);
		})
	}

	function getAllDistrict(cityId, index){
		$regionService.get.allDistrict(cityId).then(function(response){
			$scope.requiredData.address[index].listDistrict = response.result;
			$scope.requiredData.address[index].listDistrict.splice(0,0, {id: null, name: "-- Pilih Kecamatan --"});
			$scope.requiredData.address[index].selectedDistrict = $scope.requiredData.address[index].listDistrict[0];
			$scope.requiredData.address[index].district = $scope.requiredData.address[index].listDistrict[0].id;
			console.log(response);
			$scope.$apply();
		})
		.catch(function(error){
			console.log(error);
		})
	}

	function getAllUrban(districtId, index){
		$regionService.get.allUrban(districtId).then(function(response){
			$scope.requiredData.address[index].listUrban = response.result;
			$scope.requiredData.address[index].listUrban.splice(0,0, {id: null, name: "-- Pilih Kelurahan --"});
			$scope.requiredData.address[index].selectedUrban = $scope.requiredData.address[index].listUrban[0];
			$scope.requiredData.address[index].urban = $scope.requiredData.address[index].listUrban[0].id;

			$scope.$apply();
		})
		.catch(function(error){
			console.log(error);
		})
	}

	$scope.validateCreditLimit = function(){
		console.log($scope.requiredData.credit);
		if($scope.requiredData.credit){
			if( isNaN($rootScope.numberWithNoCommas($scope.requiredData.credit_limit)) ){
				return false;
			}
			else{
				$scope.requiredData.credit_limit = $rootScope.numberWithNoCommas($scope.requiredData.credit_limit);
				return true;
			}
		}
		else{
			return true;
		}
	}
	$scope.validateProvince = function(){
		for(var i=0; i<$scope.requiredData.address.length; i++){
			if($scope.requiredData.address[i].province == null){
				return false;
			}
		}
		return true;
	}

	$scope.validatePayDayAndChargeDay = function(){
		if($scope.requiredData.credit){
			if($scope.requiredData.pay_day.length == 0 || $scope.requiredData.charge_day.length == 0){
				return false;
			}
		}
		return true;
	}

	$scope.saveChanges = function() {
		var validatePayDayAndChargeDay = true;
		validatePayDayAndChargeDay = $scope.validatePayDayAndChargeDay();

		setTimeout( () => {
			if(!validatePayDayAndChargeDay){ $rootScope.triggerModal("Hari Tagih dan hari bayar harus diisi jika status kredit", "Error", "danger", ""); }			
			else{ createNewCustomer($scope.requiredData); }
		},300);
	}

	function createNewCustomer(data){
		data.credit_limit = $rootScope.numberWithNoCommas(data.credit_limit);
		setTimeout(() => {
			$customerService.post.createCustomer(data)
			.then(function(response) {
				$rootScope.triggerModal("Penambahan customer berhasil", "Success", "success", "/sales/customermaster");
			})
			.catch(function(error) {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
		}, 90);
	}

	function getAllParents() {
		$customerService.get.customer()
			.then(function(response) {
				$scope.parents = response.result;
				$scope.parents.splice(0,0, {id: null, name:"-- Pilih Induk Perushaan --"});
				$scope.$apply();

				$timeout(setInitialParent, 50);
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

	function setInitialParent() {
		$scope.requiredData.parent = $scope.parents[0].id;
		$scope.requiredData.selectedParent = $scope.parents[0];
	}

	function getAllCompanyType(){
		$customerService.get.customerType().then(response => {
			console.log(response.result);
			$scope.listCompanyType = response.result;
			$scope.listCompanyType.splice(0, 0, {name: "-- Pilih Jenis Perusahaan --"});
			$scope.requiredData.selectedCompanyType = $scope.listCompanyType[0];
			$scope.requiredData.type = $scope.listCompanyType[0].name;
			$scope.$apply();
		})
		.catch(error => {
			console.log(error);
		})
	}

});
