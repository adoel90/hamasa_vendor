distributionApp.controller('customerAuthController', function($scope, $rootScope, $customerService, $modalService){
  $rootScope.custId = encodeURIComponent(routeParams.id);

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
                    if(modalType == "success") $rootScope.redirectTo('/authorization/financeauth');
                    break;
                 }
              }
           }

        })
        .catch(function(error) {
           console.warn(error);
        })
  }

  setTimeout(()=>{
    $scope.init();
  },100);

  $scope.init = function(){
    getCustomerDetail(routeParams.id);
  }

  function getAllCreditStatus(){
		$scope.listCreditStatus = [
			{name: "Tunai", value: false},
			{name: "Kredit", value: true}
		];
		
		$scope.requiredData.selectedCreditStatus = $scope.listCreditStatus[1];
		$scope.$apply();
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
		})
		.catch(error => {
			console.log(error);
		})

	}

  $scope.changeCreditStatus = function(data){
		$scope.requiredData.credit = data.value;
    $scope.$apply();
	}

  function getCustomerDetail(id){
    $customerService.get.customerDetail(id).then(response => {
      console.log(response);
      $scope.requiredData = {
        id: response.result.id,
        type: response.result.type,
        name: response.result.name,
        npwp: response.result.npwp,
        parent: response.result.parent ?response.result.parent.id : null,
        fax: response.result.fax,
        credit: true,
        credit_limit: response.result.credit.limit ? $rootScope.numberWithCommas(response.result.credit.limit) : response.result.credit.limit,
        charge_day: response.result.credit.charge_day,
        pay_day: response.result.credit.pay_day,
        address: response.result.address,
        selectedParent: response.result.parent,
        phone: response.result.phone
      }
      for(var i=0; i<response.result.address.length; i++){
        $scope.requiredData.address[i].selectedProvince = response.result.address[i].province;
        $scope.requiredData.address[i].province = response.result.address[i].province ? response.result.address[i].province.id : null;

        $scope.requiredData.address[i].selectedCity = response.result.address[i].city;
        $scope.requiredData.address[i].city = response.result.address[i].city ? response.result.address[i].city.id : null;

        $scope.requiredData.address[i].selectedDistrict = response.result.address[i].district;
        $scope.requiredData.address[i].district = response.result.address[i].district ? response.result.address[i].district.id : null;

        $scope.requiredData.address[i].selectedUrban = response.result.address[i].urban;
        $scope.requiredData.address[i].urban = response.result.address[i].urban ? response.result.address[i].urban.id : null;
      }
      getAllCreditStatus();
      getAllCompanyType();

      setTimeout(()=>{
        $scope.$apply();
      },150);

    })
    .catch(error => {
      console.log(error);
      $scope.triggerModal(error.responseJSON.message, "Error", "danger");
    })
  }

  $scope.saveChanges = function(){
    if(isNaN($rootScope.numberWithNoCommas($scope.requiredData.credit_limit))){
      $scope.triggerModal("Limit kredit harus numerik","Error","danger");
    }
    else{
      $scope.requiredData.credit_limit = parseInt($rootScope.numberWithNoCommas($scope.requiredData.credit_limit));
      updateCustomer($scope.requiredData);
    }
  }
  function updateCustomer(data){
    console.log(data);
    $customerService.put.updateCustomer(data).then(response => {
      $scope.triggerModal("Data customer berhasil diupdate", "Success", "success");
    })
    .catch(error => {
      $scope.triggerModal(error.responseJSON.message, "Error", "danger");
    })
  }
})
