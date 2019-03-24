distributionApp.directive('mainMenu', function($filter, $rootScope){
	return {
		restrict: 'EA',
		link: function($scope, element, attrs) {
			var sidenav = angular.element(element[0].querySelector('[role="main-sidenav"]'));
			var main = angular.element(document.querySelector('main'));
			var toggle = $scope.$eval('toggle');

			$scope.menuAction = function() {
				if($rootScope.sidenavOpen){
					console.log('jadi close');
					main.toggleClass('menu--is-closed');
					$rootScope.sidenavOpen = false;
				}
				else{
					console.log('jadi open');
					main.toggleClass('menu--is-open');
					$rootScope.sidenavOpen = true;
				}
			}

			$rootScope.$on('requestToggleMenu', function() {
				$scope.menuAction();
			})


		}
	}
});
