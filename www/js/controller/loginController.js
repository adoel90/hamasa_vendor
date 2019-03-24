distributionApp.controller('loginController', function($scope, $rootScope, $uibModal, $modalService, $landingService, $myCookies){
	$scope.loginData = {
		username: '',
		password: ''
	}
	var currentDate = new Date();
	var date = currentDate.getDate()+1;
	var month = currentDate.getMonth()+1;
	var year = currentDate.getFullYear();
	var tomorrowDate = year+'-'+month+'-'+date;

	console.log(tomorrowDate);
	console.log(new Date(tomorrowDate));



	$scope.doLogin = function(){
		if($scope.loginData.username == '' || $scope.loginData.password == ''){
			$rootScope.triggerModal("Username dan password harus diisi", "Error", "danger", "");
		}
		else {
			$landingService.login($scope.loginData)
				.then(function(response){


					
					console.log(response);



					$myCookies.put('accessToken', response.result.accessToken);
					$myCookies.putObject('userData', response.result.user);
					$myCookies.putObject('modules', response.result.modules);
					$rootScope.userProfile = $myCookies.getObject("userData");
					$rootScope.modules = $myCookies.getObject("modules");
					setTimeout(function(){
						$rootScope.$broadcast('loadPageBasedOnAccessLevel');
					},100);
				})
				.catch(function(err){
					console.log(err);
					$rootScope.triggerModal(err.responseJSON.message, "Error","danger","");
				})

		}

	}
});
