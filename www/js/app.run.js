distributionApp.run(function($rootScope, $myCookies, $window, $landingService, $cookies, $window, $userService, $modalService){

	/**
	*	A helper function that checks if the passed path is
	*	found inside current URL.
	*/

	$rootScope.sidenavOpen = false;

	if($myCookies.get('accessToken')){
		$rootScope.userProfile = $myCookies.getObject("userData");
		$rootScope.accessModules = $myCookies.getObject('modules');
		console.log($myCookies.getObject('userData'));
		console.log($myCookies.getObject('modules'));

		
	}

	$rootScope.roundToTwoDecimalPlaces = function(numb){
    return +(Math.round(numb + "e+2")  + "e-2");
	}

	$rootScope.doLogout = function(){
		$cookies.remove("accessToken");
		$cookies.remove("userData");
		setTimeout(() => {
			location.href="/login";
		}, 150);
	}

	$rootScope.containsMenu = function(path){
		var link = window.location.href.split('/');
		for(var i=0; i<link.length; i++){
			if(link[i] == path){
				return true;
			}
		}
	}

	$rootScope.notificationData = {
		limit: 5,
		offset: 0
	}

	var notifIsShown = false;
	$userService.get.unreadNotifications().then(response => {
		console.log(response);
		$rootScope.totalNotification = response.result;
		$rootScope.$apply();
	})
	.catch(error => {
		console.log(error);
	})

	$rootScope.showNotification = function(){
		$rootScope.notificationData = {
			limit: 5,
			offset: 0
		}

		if(!notifIsShown){
			getListNotification($rootScope.notificationData);
			notifIsShown = true;
		}
		else{
			$(".notification").removeClass("show-notification").addClass("notification");
			notifIsShown = false;
		}
	}

	$rootScope.loadMoreNotifications = function(){
		$rootScope.notificationData.offset += $rootScope.notificationData.limit;
		$userService.get.userNotifications($rootScope.notificationData).then(response => {
			for(var i=0; i < response.result.length; i++){
				$rootScope.notificationList.push(response.result[i]);
			}
			if(response.result.length < $rootScope.notificationData.limit) $rootScope.reachEndOfData = true;
			else $rootScope.reachEndOfData = false;
			$rootScope.$apply();
		})
		.catch(error => {
			console.log(error);
		})
	}

	function getListNotification(data){
		console.log(data);
		$userService.get.userNotifications(data).then(response => {
			console.log(response.result);
			$rootScope.notificationList = response.result;

			if(response.result.length < $rootScope.notificationData.limit) $rootScope.reachEndOfData = true;
			else $rootScope.reachEndOfData = false;

			$(".notification").addClass("show-notification");
			$rootScope.$apply();
		})
		.catch(error => {
			console.log(error);
		})
	}

	$rootScope.containsPath = function(path) {
		return window.location.href.indexOf(path) != -1;
	}

	$rootScope.containsPathExactly = function(route, path) {
		return route == path;
	}

	$rootScope.redirectTo = function(path) {
		return location.href = path;
	}

	$rootScope.numberWithCommas = function(numb){
		if(numb != undefined){
			return numb.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	}

	$rootScope.numberWithNoCommas = function(numb){
		if(numb != undefined){
			return numb.toString().replace(/,/g , "");
		}
	}
	$rootScope.encodeURIComponent = function(path) {
		return encodeURIComponent(path);
	}

	$rootScope.goBack = function() {
		return $window.history.back();
	}

	$rootScope.deleteConfirmationModal = function(messageToAsk, buttonName1, buttonName2, callback){
		var modalOptions = {
			scope: $rootScope
		}

		$modalService.alert(modalOptions)
		.then(function(response) {
			$rootScope.alert = {
				type: 'danger',
				title: 'Perhatian',
				message: messageToAsk,
				button: [
					{ type: 'danger', text: buttonName1 },
					{ text: buttonName2 }
				]
			}

			$rootScope.doAction = function(index) {
				switch(index) {
					case 0: {
						callback();
						break;
					}
					case 1: {
						$modalService.close();
						break;
					}
				}
			}
		})
	}

	$rootScope.triggerModal = function(customMessage, customTitle, modalType, successLink){
     var modalOptions = {
        scope: $rootScope
     }

     $modalService.alert(modalOptions)
        .then(function() {
           $rootScope.alert = {
              type: modalType,
              title: customTitle,
              message: customMessage,
              button: [
                 { type: modalType, text: 'Kembali' }
              ]
           }

           $rootScope.doAction = function(index) {
              switch(index) {
                 case 0: {
                    $modalService.close();
                    if(modalType == "success") $rootScope.redirectTo(successLink);
                    break;
                 }
              }
           }

        })
        .catch(function(error) {
           console.warn(error);
        })
  }
	  
	  //access level
	  // 1: admin
	  // 8: director
	  // 2: sales
	  // 9: supervisor sales

	$rootScope.$on('loadPageBasedOnAccessLevel', function(){
		if($rootScope.userProfile.access.id == 1 || $rootScope.userProfile.access.id == 8){
			$rootScope.redirectTo('/dashboard');
		}
		else if($rootScope.userProfile.access.id == 2 || $rootScope.userProfile.access.id == 9){
			$rootScope.redirectTo('/sales');
		}
		else if($rootScope.userProfile.access.id == 3 || $rootScope.userProfile.access.id == 7 || $rootScope.userProfile.access.id == 11){
			$rootScope.redirectTo('/inventory');
		}
		else if($rootScope.userProfile.access.id == 4 || $rootScope.userProfile.access.id == 10){
			$rootScope.redirectTo('/purchasing');
		}
		else if($rootScope.userProfile.access.id == 5 || $rootScope.userProfile.access.id == 6 || $rootScope.userProfile.access.id == 13){
			$rootScope.redirectTo('/finance');
		}
	});

	$rootScope.$on('$stateChangeStart', function(ev) {
		$rootScope.$window = $window;
		var accessToken = $myCookies.get('accessToken');
	});

});
