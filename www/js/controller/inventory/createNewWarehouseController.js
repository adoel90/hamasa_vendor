distributionApp.controller('createNewWarehouseController', function($scope, $rootScope,
    $warehouseService, $regionService, $modalService, $window, $timeout) {

	'use strict';

    $scope.requiredData = {
        code: '',
        name: '',
        address: '',
        province: '',
        selectedProvince: {},
        city: '',
        selectedCity: {},
        district: '',
        selectedDistrict: {},
        urban: '',
        selectedUrban: {},
        postal_code: '',
        phone: '',
        fax: '',
        contact_person: '',
        do_code: '',
        bkb_code: '',
        btb_code: ''
    }
    $scope.listProvince = []; $scope.listCity = []; $scope.listDistrict = []; $scope.listUrban = [];

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
    $scope.init = function() {
      getAllProvince();
      setDefaultValue_Of_Province_Cites_District_Urban();
    }

    function setDefaultValue_Of_Province_Cites_District_Urban(){

  		getAllProvince();
  		setDefaultValueOfCity();
  		setDefaultValueOfDistrict();

  		setTimeout( () => {
  			setDefaultValueOfUrban();
  		},150);

  		$scope.$apply();
  	}

    function setDefaultValueOfCity(){
  		$scope.listCity = [];
  		$scope.listCity.push( {id: null, name: "-- Pilih Kota --"} );
  		$scope.requiredData.city = $scope.listCity[0].id;
  		$scope.requiredData.selectedCity = $scope.listCity[0];
  	}

  	function setDefaultValueOfDistrict(){
  		$scope.listDistrict = [];
  		$scope.listDistrict.push( {id: null, name: "-- Pilih Kecamatan --"} );
  		$scope.requiredData.district = $scope.listDistrict[0].id;
  		$scope.requiredData.selectedDistrict = $scope.listDistrict[0];
  	}

  	function setDefaultValueOfUrban(){
  		$scope.listUrban = [];
  		$scope.listUrban.push( {id: null, name: "-- Pilih Kelurahan --"});
  		$scope.requiredData.urban = $scope.listUrban[0].id;
  		$scope.requiredData.selectedUrban = $scope.listUrban[0];
  		$scope.$apply();
  	}

    function getAllProvince(){
      $regionService.get.allProvince().then(function(response){

  			$scope.listProvince = response.result;
  			$scope.listProvince.splice(0,0, {id: null, name: "-- Pilih Provinsi --"} );

       setTimeout( () => {
         $scope.requiredData.province = $scope.listProvince[0].id;
    			$scope.requiredData.selectedProvince = $scope.listProvince[0];
    			$scope.$apply();
       },50);
  		})
  		.catch(function(error){
  			console.log(error);
  		})
    }

    function getAllCity(provinceId){
  		$regionService.get.allCities(provinceId).then(function(response){
  			console.log(response);
  			$scope.listCity = response.result;
  			$scope.listCity.splice(0,0,{id: null, name: "-- Pilih Kota --"});
  			$scope.requiredData.selectedCity = $scope.listCity[0];
  			$scope.requiredData.city = $scope.listCity[0].id;

  			$scope.$apply();
  		})
  		.catch(function(error){
  			console.log(error);
  		})
  	}

  	function getAllDistrict(cityId){
  		$regionService.get.allDistrict(cityId).then(function(response){
  			$scope.listDistrict = response.result;
  			$scope.listDistrict.splice(0,0, {id: null, name: "-- Pilih Kecamatan --"});
  			$scope.requiredData.selectedDistrict = $scope.listDistrict[0];
  			$scope.requiredData.district = $scope.listDistrict[0].id;
  			$scope.$apply();
  		})
  		.catch(function(error){
  			console.log(error);
  		})
  	}

  	function getAllUrban(districtId, index){
  		$regionService.get.allUrban(districtId).then(function(response){
  			$scope.listUrban = response.result;
  			$scope.listUrban.splice(0,0, {id: null, name: "-- Pilih Kelurahan --"});
  			$scope.requiredData.selectedUrban = $scope.listUrban[0];
  			$scope.requiredData.urban = $scope.listUrban[0].id;

  			$scope.$apply();
  		})
  		.catch(function(error){
  			console.log(error);
  		})
  	}

    $scope.changeProvince = function(province){
  		$scope.requiredData.province = province.id;
  		$scope.requiredData.selectedProvice = province;

  		getAllCity(province.id);
  	 }

    $scope.changeCity = function(city){
  			$scope.requiredData.city = city.id;
  			$scope.requiredData.selectedCity = city;
  			getAllDistrict(city.id);
  	 }

  	$scope.validateCity = function(){
  		if($scope.requiredData.province == null){
  			$scope.triggerModal("Provinsi harus dipilih terlebih dahulu", "Error", "danger");
  			return;
  		}
  	}

  	$scope.changeDistrict = function(district){
  		$scope.requiredData.district = district.id;
  		$scope.requiredData.selectedDistrict = district;
  		getAllUrban(district.id);
  	}

  	$scope.validateDistrict = function(){
  		if($scope.requiredData.city == null){
  			$scope.triggerModal("Kota harus dipilih terlebih dahulu", "Error", "danger");
  			return;
  		}
  	}

  	$scope.changeUrban = function(urban){
  		$scope.requiredData.urban = urban.id;
  		$scope.requiredData.selectedUrban = urban;
  	}

  	$scope.validateUrban = function(){
  		if($scope.requiredData.district == null){
  			$scope.triggerModal("Kecamatan harus dipilih terlebih dahulu", "Error", "danger");
  			return;
  		}
  	}

    $scope.save = function() {
        console.log($scope.requiredData);
        if($scope.requiredData.province == null) $scope.triggerModal("Provinsi harus diisi", "Error", "danger");
        else createNewWarehouse($scope.requiredData);
    }

    function createNewWarehouse(data){
      $warehouseService.post.addWarehouse(data)
      .then(function(response) {
        $scope.triggerModal("Tambah Gudang berhasil", "Success", "success");
      })
      .catch(function(error) {
        $scope.triggerModal(error.responseJSON.message,"Error","danger");
      });
    }

    $timeout(function() {
        $scope.init();
    }, 0)
});
