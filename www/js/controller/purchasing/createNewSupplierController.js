distributionApp.controller('createNewSupplierController', function($scope, $supplierService, $modalService, $window, $regionService, $rootScope){
   $scope.supplierData = {
      type: '',
      name: '',
      npwp: '',
      address: '',
      province: '',
      city: '',
      district: '',
      urban: '',
      postal_code: '',
      phone: '',
      fax: '',
      contact_person: '',
      selectedCompanyType: null,
      selectedProvince: null,
      selectedCity: null,
      selectedDistrict: null,
      selectedUrban: null
   }

   $scope.listProvince = [];
   $scope.listCity = [];
   $scope.listDistrict = [];
   $scope.listUrban = [];

   setTimeout(function(){
      $scope.init();
   },300);

   $scope.init = function(){
      setDefaultValue_Of_Province_Cites_District_Urban();
      getAllCompanyType();
   }

   function getAllCompanyType(){
 		$supplierService.get.supplierType().then(response => {
 			console.log(response.result);
 			$scope.listCompanyType = response.result;
 			$scope.supplierData.selectedCompanyType = $scope.listCompanyType[0];
 			$scope.supplierData.type = $scope.listCompanyType[0].name;
 			$scope.$apply();
 		})
 		.catch(error => {
 			console.log(error);
 		})
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

   function getAllProvince(){
     $regionService.get.allProvince().then(function(response){

 			$scope.listProvince = response.result;
 			$scope.listProvince.splice(0,0, {id: null, name: "-- Pilih Provinsi --"} );

      setTimeout( () => {
        $scope.supplierData.province = $scope.listProvince[0].id;
   			$scope.supplierData.selectedProvince = $scope.listProvince[0];
   			$scope.$apply();
      },50);
 		})
 		.catch(function(error){
 			console.log(error);
 		})
   }


   function setDefaultValueOfCity(){
 		$scope.listCity = [];
 		$scope.listCity.push( {id: null, name: "-- Pilih Kota --"} );
 		$scope.supplierData.city = $scope.listCity[0].id;
 		$scope.supplierData.selectedCity = $scope.listCity[0];
 	}

 	function setDefaultValueOfDistrict(){
 		$scope.listDistrict = [];
 		$scope.listDistrict.push( {id: null, name: "-- Pilih Kecamatan --"} );
 		$scope.supplierData.district = $scope.listDistrict[0].id;
 		$scope.supplierData.selectedDistrict = $scope.listDistrict[0];
 	}

 	function setDefaultValueOfUrban(){
 		$scope.listUrban = [];
 		$scope.listUrban.push( {id: null, name: "-- Pilih Kelurahan --"});
 		$scope.supplierData.urban = $scope.listUrban[0].id;
 		$scope.supplierData.selectedUrban = $scope.listUrban[0];
 		$scope.$apply();
 	}

   function getAllCity(provinceId) {
      $regionService.get.allCities(provinceId).then(function(response) {
         console.log(response.result);
         $scope.listCity = response.result;
         $scope.listCity.splice(0,0, {id: null, name: "-- Pilih Kota --"});
         $scope.supplierData.selectedCity = $scope.listCity[0];
         $scope.supplierData.city = $scope.listCity[0].id;
         $scope.$apply();

      })
      .catch(function(error) {
        console.log(error);
      })
   }

   function getAllDistrict(cityId){
 		$regionService.get.allDistrict(cityId).then(function(response){
      $scope.listDistrict = response.result;
      $scope.listDistrict.splice(0,0, {id: null, name: "-- Pilih Kecamatan --"});
 			$scope.supplierData.selectedDistrict = $scope.listDistrict[0];
 			$scope.supplierData.district = $scope.listDistrict[0].id;

 			$scope.$apply();
 		})
 		.catch(function(error){
 			console.log(error);
 		})
 	}

  function getAllUrban(){
		$regionService.get.allUrban($scope.supplierData.district).then(function(response){
      $scope.listUrban = response.result;
      $scope.listUrban.splice(0,0, {id: null, name: "-- Pilih Kelurahan --"});
			$scope.supplierData.selectedUrban = $scope.listUrban[0];
			$scope.supplierData.urban = $scope.listUrban[0].id;

			$scope.$apply();
		})
		.catch(function(error){
			console.log(error);
		})
	}

   $scope.changeCompany = function(data){
     $scope.supplierData.type = data.name;
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

   $scope.changeProvince = function(province){
 		$scope.supplierData.province = province.id;
 		$scope.supplierData.selectedProvice = province;

 		getAllCity(province.id);
 	 }

   $scope.changeCity = function(city){
 			$scope.supplierData.city = city.id;
 			$scope.supplierData.selectedCity = city;
 			getAllDistrict(city.id);
 	 }

   	$scope.validateCity = function(){
   		if($scope.supplierData.province == null){
   			$scope.triggerModal("Provinsi harus dipilih terlebih dahulu", "Error", "danger");
   			return;
   		}
   	}

   	$scope.changeDistrict = function(district){
   		$scope.supplierData.district = district.id;
   		$scope.supplierData.selectedDistrict = district;
   		getAllUrban(district.id);
   	}

   	$scope.validateDistrict = function(){
   		if($scope.supplierData.city == null){
   			$scope.triggerModal("Kota harus dipilih terlebih dahulu", "Error", "danger");
   			return;
   		}
   	}

   	$scope.changeUrban = function(urban, index){
   		$scope.supplierData.urban = urban.id;
   		$scope.supplierData.selectedUrban = urban;
   	}

   	$scope.validateUrban = function(){
   		if($scope.supplierData.district == null){
   			$scope.triggerModal("Kecamatan harus dipilih terlebih dahulu", "Error", "danger");
   			return;
   		}
   	}

   $scope.save = function(){
     if($scope.supplierData.province == null) $scope.triggerModal("Provinsi harus diisi", "Error", "danger");
     else createNewSupplier();
   }

   function createNewSupplier(){
     $supplierService.post.newSupplier($scope.supplierData).then(function(response){
        $scope.triggerModal("Tambah supplier berhasil", "Success", "success");
     })
     .catch(function(error){
        $scope.triggerModal(error.responseJSON.message, "Error", "danger");
     })
   }

});
