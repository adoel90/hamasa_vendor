distributionApp.controller('editSupplierController', function($rootScope, $scope, $supplierService, $modalService, $window, $regionService){
  $rootScope.supplierId = encodeURIComponent(routeParams.id);
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
      city_data: null
   }

   setTimeout(function(){
      $scope.init();
   },300);

   $scope.init = function(){
      getSupplierDetail();
   }

   function getAllCompanyType(){
 		$supplierService.get.supplierType().then(response => {
 			$scope.listCompanyType = response.result;
 			for(var i=0; i<$scope.listCompanyType.length; i++){
 				if($scope.listCompanyType[i].name.toLowerCase() == $scope.supplierData.type.toLowerCase()){
 					$scope.supplierData.selectedCompanyType = $scope.listCompanyType[i];
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

  $scope.changeCompany = function(data){
		$scope.supplierData.type = data.name;
	}

   function getSupplierDetail(){
      $supplierService.get.detailSupplier(routeParams.id).then(function(response){
         console.log(response);
         $scope.supplierData = {
            type: response.result.type,
            id: response.result.id,
            name: response.result.name,
            npwp: response.result.npwp,
            address: response.result.address,
            province: response.result.province,
            city: response.result.city,
            district: response.result.district,
            urban: response.result.urban,
            postal_code: response.result.postal_code,
            phone: response.result.phone,
            fax: response.result.fax,
            contact_person: response.result.contact_person,
            city_data: null
         }
         setTimeout( () => {
           getAllCompanyType();
         },50);

         setTimeout(()=>{
           initSelectedProvince($scope.supplierData);
           initSelectedCity($scope.supplierData);
           initSelectedDistrict($scope.supplierData);
           initSelectedUrban($scope.supplierData);
         },800);

         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   function getAllProvince(){
     $regionService.get.allProvince().then(function(response){

 			$scope.listProvince = response.result;
 			$scope.listProvince.splice(0,0, {id: null, name: "-- Pilih Provinsi --"} );
      for(var i=0; i<$scope.listProvince.length; i++){
        if($scope.listProvince[i].id == $scope.supplierData.province){
          $scope.supplierData.selectedProvince = $scope.listProvince[i];
          break;
        }
      }
   		$scope.$apply();
 		})
 		.catch(function(error){
 			console.log(error);
 		})
   }

   function initSelectedProvince(supplierData){
 		$regionService.get.allProvince().then(function(response){

 			$scope.listProvince = response.result;
 			$scope.listProvince.splice(0,0, {id: null, name: "-- Pilih Provinsi --"} );
      if(supplierData.province != null){
        supplierData.selectedProvince = supplierData.province;
        supplierData.province = supplierData.province.id;
      }
      else{
        supplierData.selectedProvince = $scope.listProvince[0];
      }
 			$scope.$apply();
 		})
 		.catch(function(error){
 			console.log(error);
 		})
 	}

  function initSelectedCity(supplierData){
		if(supplierData.province != null){
			$regionService.get.allCities($scope.supplierData.province.id).then(function(response){
				$scope.listCity = response.result;
				$scope.listCity.splice(0,0,{id: null, name: "-- Pilih Kota --"});

				if(supplierData.city == null){
					supplierData.selectedCity = $scope.listCity[0];
				}
				else{
					supplierData.selectedCity = supplierData.city;
					supplierData.city = supplierData.city.id;
				}
        $scope.$apply();
			})
			.catch(function(error){
				console.log(error);
			})
		}
		else{
			$scope.listCity = [{id: null, name: "-- Pilih Kota --"}];
			supplierData.selectedCity = $scope.listCity[0];
			supplierData.city = $scope.listCity[0].id;
      $scope.$apply();
		}

	}

  function initSelectedDistrict(supplierData){
		if(supplierData.city != null){
			$regionService.get.allDistrict(supplierData.city.id).then(function(response){
				$scope.listDistrict = response.result;
        console.log(response);
				$scope.listDistrict.splice(0,0, {id: null, name: "-- Pilih Kecamatan --"});
				if(supplierData.district == null){
					supplierData.selectedDistrict = $scope.listDistrict[0];
				}
				else{
					supplierData.selectedDistrict = supplierData.district;
					supplierData.district = supplierData.district.id;
				}
        $scope.$apply();
			})
			.catch(function(error){
				console.log(error);
			})
		}
		else{
			$scope.listDistrict = [{id: null, name: "-- Pilih Kecamatan --"}];
			supplierData.selectedDistrict = $scope.listDistrict[0];
			supplierData.district = $scope.listDistrict[0].id;
      $scope.$apply();
		}
	}
  function initSelectedUrban(supplierData){
		if(supplierData.district != null){
			$regionService.get.allUrban(supplierData.district.id).then(function(response){
				$scope.listUrban = response.result;
				$scope.listUrban.splice(0,0, {id: null, name: "-- Pilih Kelurahan --"});
				if(supplierData.urban == null){
					supplierData.selectedUrban = $scope.listUrban[0];
				}
				else{
					supplierData.selectedUrban = supplierData.urban;
					supplierData.urban = supplierData.urban.id;
				}
        $scope.$apply();
			})
			.catch(function(error){
				console.log(error);
			})
		}
		else{
			$scope.listUrban = [{id: null, name: "-- Pilih Kelurahan --"}];
			supplierData.selectedUrban = $scope.listUrban[0];
			supplierData.urban = $scope.listUrban[0].id;
      $scope.$apply();
		}
	}


  function getAllCity(provinceId){
		$regionService.get.allCities(provinceId).then(function(response){
			console.log(response);
			$scope.listCity = response.result;
			$scope.listCity.splice(0,0,{id: null, name: "-- Pilih Kota --"});
			$scope.supplierData.selectedCity = $scope.listCity[0];
			$scope.supplierData.city = $scope.listCity[0].id;

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
			$scope.supplierData.selectedDistrict = $scope.listDistrict[0];
			$scope.supplierData.district = $scope.listDistrict[0].id;
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
			$scope.supplierData.selectedUrban = $scope.listUrban[0];
			$scope.supplierData.urban = $scope.listUrban[0].id;

			$scope.$apply();
		})
		.catch(function(error){
			console.log(error);
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

   $scope.save = function(){
     if($scope.supplierData.province == null) $scope.triggerModal("Provinsi harus diisi", "Error", "danger");
     else updateSupplier($scope.supplierData);
   }

   function updateSupplier(data){
     $supplierService.put.detailSupplier(data).then(function(response){
        $scope.triggerModal("Supplier berhasil diupdate", "Success", "success");
     })
     .catch(function(error){
        $scope.triggerModal(error.responseJSON.message, "Error", "danger");
     })
   }
});
