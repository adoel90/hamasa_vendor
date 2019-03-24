distributionApp.controller('editWarehouseController', function($scope, $rootScope,
    $warehouseService, $modalService, $regionService, $window, $timeout) {

	'use strict';

    $rootScope.warehouseId = encodeURIComponent(routeParams.id);
    $scope.requiredData = {
        id: '',
        code: '',
        name: '',
        address: '',
        city: '',
        city_data: '',
        phone: '',
        fax: '',
        contact_person: ''
    };

    $scope.listProvince = []; $scope.listCity = []; $scope.listDistrict = []; $scope.listUrban = [];
    $scope.init = function() {
        getWarehouseDetail(routeParams.id);
    }

    $scope.save = function() {
      console.log($scope.requiredData);
      if($scope.requiredData.province == null) $scope.triggerModal("Provinsi harus diisi", "Error", "danger");
      else updateWarehouse($scope.requiredData);
    }

    function updateWarehouse(data){
      $warehouseService.put.updateWarehouse(data)
      .then(function(response) {
        $scope.triggerModal("Update gudang berhasil!","Success","success");
      })
      .catch(function(error) {
        $scope.triggerModal(error.responseJSON.message, "Error", "danger");
      });
    }

    $timeout(function() {
        $scope.init();
    }, 50)

    function initSelectedProvince(warehouseData){
  		$regionService.get.allProvince().then(function(response){

  			$scope.listProvince = response.result;
  			$scope.listProvince.splice(0,0, {id: null, name: "-- Pilih Provinsi --"} );
       if(warehouseData.province != null){
         warehouseData.selectedProvince = warehouseData.province;
         warehouseData.province = warehouseData.province.id;
       }
       else{
         warehouseData.selectedProvince = $scope.listProvince[0];
       }
  		})
  		.catch(function(error){
  			console.log(error);
  		})
  	}

   function initSelectedCity(warehouseData){
 		if(warehouseData.province != null){
 			$regionService.get.allCities(warehouseData.province.id).then(function(response){
 				$scope.listCity = response.result;
 				$scope.listCity.splice(0,0,{id: null, name: "-- Pilih Kota --"});

 				if(warehouseData.city == null){
 					warehouseData.selectedCity = $scope.listCity[0];
 				}
 				else{
 					warehouseData.selectedCity = warehouseData.city;
 					warehouseData.city = warehouseData.city.id;
 				}
 			})
 			.catch(function(error){
 				console.log(error);
 			})
 		}
 		else{
 			$scope.listCity = [{id: null, name: "-- Pilih Kota --"}];
 			warehouseData.selectedCity = $scope.listCity[0];
 			warehouseData.city = $scope.listCity[0].id;
 		}

 	}

   function initSelectedDistrict(warehouseData){
 		if(warehouseData.city != null){
 			$regionService.get.allDistrict(warehouseData.city.id).then(function(response){
 				$scope.listDistrict = response.result;
         console.log(response);
 				$scope.listDistrict.splice(0,0, {id: null, name: "-- Pilih Kecamatan --"});
 				if(warehouseData.district == null){
 					warehouseData.selectedDistrict = $scope.listDistrict[0];
 				}
 				else{
 					warehouseData.selectedDistrict = warehouseData.district;
 					warehouseData.district = warehouseData.district.id;
 				}
 			})
 			.catch(function(error){
 				console.log(error);
 			})
 		}
 		else{
 			$scope.listDistrict = [{id: null, name: "-- Pilih Kecamatan --"}];
 			warehouseData.selectedDistrict = $scope.listDistrict[0];
 			warehouseData.district = $scope.listDistrict[0].id;
 		}
 	}
   function initSelectedUrban(warehouseData){
 		if(warehouseData.district != null){
 			$regionService.get.allUrban(warehouseData.district.id).then(function(response){
 				$scope.listUrban = response.result;
 				$scope.listUrban.splice(0,0, {id: null, name: "-- Pilih Kelurahan --"});
 				if(warehouseData.urban == null){
 					warehouseData.selectedUrban = $scope.listUrban[0];
 				}
 				else{
 					warehouseData.selectedUrban = warehouseData.urban;
 					warehouseData.urban = warehouseData.urban.id;
 				}
 			})
 			.catch(function(error){
 				console.log(error);
 			})
 		}
 		else{
 			$scope.listUrban = [{id: null, name: "-- Pilih Kelurahan --"}];
 			warehouseData.selectedUrban = $scope.listUrban[0];
 			warehouseData.urban = $scope.listUrban[0].id;
 		}
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
    function getWarehouseDetail(id) {
        $warehouseService.get.warehouseDetail(id)
            .then(function(response) {
                console.log(response);
                $scope.requiredData = response.result;

                setTimeout( () => {
                  initSelectedProvince($scope.requiredData);
                  initSelectedCity($scope.requiredData);
                  initSelectedDistrict($scope.requiredData);
                  initSelectedUrban($scope.requiredData);
                }, 500);

                setTimeout( () => {
                  $scope.$apply();
                }, 700);
            })
            .catch(function(error) {

            });
    }
});
