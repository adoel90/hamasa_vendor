distributionApp.controller('editCustomerController', function($scope, $rootScope,
	$customerService, $regionService, $modalService, $window, $timeout) {

	'use strict';

	var customerId = routeParams.id;
	$rootScope.custId = encodeURIComponent(routeParams.id);
	$scope.requiredData = {};
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
		listUrban: [],
		selectedCreditStatus: null
	}

	$scope.listDay = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

	$scope.init = function() {
		getCustomerDetail();
	}

	function getAllCreditStatus(){
		console.log($scope.requiredData);
		$scope.listCreditStatus = [
			{name: "Tunai", value: false},
			{name: "Kredit", value: true}
		];
		for(var i=0; i < $scope.listCreditStatus.length; i++){
			if($scope.requiredData.credit == $scope.listCreditStatus[i].value){
				$scope.requiredData.selectedCreditStatus = $scope.listCreditStatus[i];
				break;
			}
		}
		$scope.$apply();
	}

	$scope.changeCreditStatus = function(data){
		$scope.requiredData.credit = data.value;
	}
	//
	$scope.addMoreAddress = function() {
		setDefaultValue_Of_Province_Cites_District_Urban();
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

	$scope.changeCompany = function(data){
		$scope.requiredData.type = data.name;
	}

	$scope.changeProvince = function(province, index){
		$scope.requiredData.address[index].province = province.id;
		$scope.requiredData.address[index].selectedProvince = province;

		getAllCities(province.id, index);
	}

	$scope.changeCity = function(city, index){
			$scope.requiredData.address[index].city = city.id;
			$scope.requiredData.address[index].selectedCity = city;
			getAllDistrict(city.id, index);
	}

	$scope.changeDistrict = function(district, index){
		$scope.requiredData.address[index].district = district.id;
		$scope.requiredData.address[index].selectedDistrict = district;
		getAllUrban(district.id, index);
	}

	$scope.changeUrban = function(urban, index){
		$scope.requiredData.address[index].urban = urban.id;
		$scope.requiredData.address[index].selectedUrban = urban;
	}

	$scope.changeParent = function(parent) {
		$scope.requiredData.parent = parent.id;
		$scope.requiredData.selectedParent = parent;

		console.log($scope.requiredData);
	}

	function getAllCompanyType(){
		$customerService.get.customerType().then(response => {
			console.log(response);
			$scope.listCompanyType = response.result;
			for(var i=0; i<$scope.listCompanyType.length; i++){
				if($scope.listCompanyType[i].name.toLowerCase() == $scope.requiredData.type.toLowerCase()){
					$scope.requiredData.selectedCompanyType = $scope.listCompanyType[i];
					break;
				}
			}
			setTimeout( () => {
				$scope.$apply();
			}, 200);

		})
		.catch(error => {
			console.log(error);
		})

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

	$scope.validatePayDayAndChargeDay = function(){
		if($scope.requiredData.credit){
			if($scope.requiredData.pay_day == null || $scope.requiredData.charge_day == null){
				return false;
			}
			else if($scope.requiredData.pay_day.length == 0 || $scope.requiredData.charge_day.length == 0){
				return false;
			}
		}
		return true;
	}

	$scope.saveChanges = function() {
		var validationSucceed = true;
		var validatePayDayAndChargeDay = true;

		validatePayDayAndChargeDay = $scope.validatePayDayAndChargeDay();

		if($scope.requiredData.credit){
			if(isNaN( $rootScope.numberWithNoCommas($scope.requiredData.credit_limit) )){
				$rootScope.triggerModal("Limit Kredit harus numerik", "Error", "danger", "");
				validationSucceed = false;
			}
			else if(!validatePayDayAndChargeDay){
				$rootScope.triggerModal("Hari tagih dan hari bayar harus diisi", "Error", "danger", "");
				validationSucceed = false;
			}
			else{
				$scope.requiredData.credit_limit = $rootScope.numberWithNoCommas($scope.requiredData.credit_limit);
			}
		}

		setTimeout(()=>{
			if(validationSucceed){
				$scope.requiredData.credit_limit = $rootScope.numberWithNoCommas($scope.requiredData.credit_limit);
				setTimeout(() => { updateCustomerData($scope.requiredData); }, 70);
			}
		}, 400);
	}

	function updateCustomerData(data){
		$customerService.put.updateCustomer(data)
			.then(function(response) {
				$rootScope.triggerModal("Perubahan data customer berhasil", "Success", "success", "/sales/customermaster/");
			})
			.catch(function(error) {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
	}

	$timeout($scope.init, 50);

	function initSelectedProvince(addressObj){
		$regionService.get.allProvince().then(function(response){

			addressObj.listProvince = response.result;
			addressObj.listProvince.splice(0,0, {id: null, name: "-- Pilih Provinsi --"} );
			if(addressObj.province == null){
				addressObj.selectedProvince = addressObj.listProvince[0];
			}
			else {
				addressObj.selectedProvince = addressObj.province;
				addressObj.province = addressObj.province.id;
			}
		})
		.catch(function(error){
			console.log(error);
		})
	}

	function initSelectedCity(addressObj){
		if(addressObj.province != null){
			$regionService.get.allCities(addressObj.province.id).then(function(response){
				addressObj.listCities = response.result;
				addressObj.listCities.splice(0,0,{id: null, name: "-- Pilih Kota --"});

				if(addressObj.city == null){
					addressObj.selectedCity = addressObj.listCities[0];
				}
				else{
					addressObj.selectedCity = addressObj.city;
					addressObj.city = addressObj.city.id;
				}
			})
			.catch(function(error){
				console.log(error);
			})
		}
		else{
			addressObj.listCities = [{id: null, name: "-- Pilih Kota --"}];
			addressObj.selectedCity = addressObj.listCities[0];
			addressObj.city = addressObj.listCities[0].id;
		}

	}

	function initSelectedDistrict(addressObj){
		if(addressObj.city != null){
			$regionService.get.allDistrict(addressObj.city.id).then(function(response){
				addressObj.listDistrict = response.result;
				addressObj.listDistrict.splice(0,0, {id: null, name: "-- Pilih Kecamatan --"});
				if(addressObj.district == null){
					addressObj.selectedDistrict = addressObj.listDistrict[0];
				}
				else{
					addressObj.selectedDistrict = addressObj.district;
					addressObj.district = addressObj.district.id;
				}

			})
			.catch(function(error){
				console.log(error);
			})
		}
		else{
			addressObj.listDistrict = [{id: null, name: "-- Pilih Kecamatan --"}];
			addressObj.selectedDistrict = addressObj.listDistrict[0];
			addressObj.district = addressObj.listDistrict[0].id;
		}
	}

	function initSelectedUrban(addressObj){
		if(addressObj.district != null){
			$regionService.get.allUrban(addressObj.district.id).then(function(response){
				addressObj.listUrban = response.result;
				addressObj.listUrban.splice(0,0, {id: null, name: "-- Pilih Kelurahan --"});
				if(addressObj.urban == null){
					addressObj.selectedUrban = addressObj.listUrban[0];
				}
				else{
					addressObj.selectedUrban = addressObj.urban;
					addressObj.urban = addressObj.urban.id;
				}
			})
			.catch(function(error){
				console.log(error);
			})
		}
		else{
			addressObj.listUrban = [{id: null, name: "-- Pilih Kelurahan --"}];
			addressObj.selectedUrban = addressObj.listUrban[0];
			addressObj.urban = addressObj.listUrban[0].id;
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

	$scope.validateCity = function(index){
		if($scope.requiredData.address[index].province == null || $scope.requiredData.address[index].province == ""){
			$scope.triggerModal("Provinsi harus dipilih terlebih dahulu", "Error", "danger");
			return;
		}
	}

	$scope.validateDistrict = function(index){
		if($scope.requiredData.address[index].city == null || $scope.requiredData.address[index].city == ""){
			$scope.triggerModal("Kota harus dipilih terlebih dahulu", "Error", "danger");
			return;
		}
	}

	$scope.validateUrban = function(index){
		if($scope.requiredData.address[index].district == null || $scope.requiredData.address[index].district == ""){
			$scope.triggerModal("Kecamatan harus dipilih terlebih dahulu", "Error", "danger");
			return;
		}
	}

	$scope.triggerModal = function(customMessage, customTitle, modalType){
		 var modalOptions = {
				scope: $scope
		 }

		 $modalService.alert(modalOptions)
		.then(function() {
				$scope.alert = {
					type: modalType,
					title: customTitle,
					message: customMessage,
					button: [
							{ type: modalType, text: 'Kembali' }
					]
				}

				$scope.doAction = function(index) {
					switch(index) {
							case 0: {
								$modalService.close();
								if(modalType == "success") $window.history.back();
								break;
							}
					}
				}

		})
		.catch(function(error) {
				console.warn(error);
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
	}

	function getCustomerDetail() {
		$customerService.get.customerDetail(customerId)
			.then(function(response) {
				console.log(response);
				var customerDetail = response.result;

				$scope.requiredData = {
					type: customerDetail.type,
					id: customerId,
					name: customerDetail.name,
					npwp: customerDetail.npwp,
					fax: customerDetail.fax,
					credit: customerDetail.credit.status,
					phone: customerDetail.phone,
					address: customerDetail.address,
					parent: customerDetail.parent ? customerDetail.parent : null,
					selectedParent: {},
					credit_limit: customerDetail.credit.limit ? $rootScope.numberWithCommas(customerDetail.credit.limit) : "",
					charge_day: customerDetail.credit.charge_day,
					pay_day: customerDetail.credit.pay_day,
					region: customerDetail.region,
					selectedCustRegion: null
				}

				getAllCompanyType();
				getAllParents();
				getAllCreditStatus();

				setTimeout( () => {
					for(var i=0; i<$scope.requiredData.address.length; i++){
						initSelectedProvince($scope.requiredData.address[i]);
						initSelectedCity($scope.requiredData.address[i]);
						initSelectedDistrict($scope.requiredData.address[i]);
						initSelectedUrban($scope.requiredData.address[i]);
					}
				},1000);

				setTimeout(() => {
					$scope.$apply();
				},1500);
			})
			.catch(function(error) {
				$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
			})
	}

	function getAllParents() {
		$customerService.get.customer()
			.then(function(response) {
				console.log(response);
				$scope.parents = response.result;
				$scope.parents.splice(0,0,{id: null, name: "--Pilih Induk Perusahaan --"});
				if($scope.requiredData.parent == null){
					$scope.requiredData.selectedParent = $scope.parents[0];
				}
				else{
					for(var i=0; i < $scope.parents.length; i++){
						if($scope.parents[i].id == $scope.requiredData.parent.id){
							$scope.requiredData.selectedParent = $scope.parents[i];
							break;
						}
					}
				}

				$scope.$apply();
			})
			.catch(function(error) {
				console.warn(error);
			})
	}

});
