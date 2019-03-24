distributionApp
	.directive('pagination', pagination);

function pagination($rootScope, $timeout, $window, $parse) {
	return {
		restrict: "EA",
		templateUrl: '/dist/view/widget/pagination.html',
		link: function($scope, element, attrs) {

			$scope.currentPage = 0;
			$scope.limitTo = 10;
			$scope.pages = [];

			$scope.showPageBeforeSymbol = false;
			$scope.showNextPageSymbol = false;

			$scope.$watch(function() {
				$scope.data = $scope.$eval(attrs.data);
				$scope.rows = $scope.$eval(attrs.totalRows);
			})

			function showOrHidePage(start, end, type){
				for(var i=start; i<end; i++){
					if(type == "show"){
						$scope.pages[i].show = true;
					}
					else if(type == "hide"){
						$scope.pages[i].show = false;
					}
				}
			}

			$scope.updatePages = function() {
				console.log($scope.rows);
				$scope.pages = [];
				var offset = 0;
				var i = 0;

				while($scope.rows > offset) {
					if(i<10){
						$scope.showNextPageSymbol = false;
						$scope.pages.push({
							numb: i + 1,
							show: true
						});
					}
					else{
						$scope.pages.push({
							numb: i + 1,
							show: false
						});
					}
					offset += 10;
					i++;
				}
				if($scope.pages.length > $scope.limitTo) $scope.showNextPageSymbol = true;
			}

			$scope.$watch('rows', function() {
				$scope.updatePages();
				$scope.currentPage = 0;
				// $scope.goToPage(0);
			}, true);


			$scope.goToPage = function(index) {
				$scope.data.offset = $scope.data.limit * (index);
				$scope.currentPage = index;
				$rootScope.$broadcast('requestFetchData');
			}

			$scope.goToFirstPageOrLastPage = function(type){
				if(type == "firstPage"){
					showOrHidePage(0, 10, "show");
					showOrHidePage(10, $scope.pages.length, "hide");
					$scope.currentPage = 0;
					$scope.data.offset = $scope.data.limit * $scope.currentPage;
					$scope.showPageBeforeSymbol = false;
					$scope.showNextPageSymbol = true;
				}
				else if(type == "lastPage"){
					var totalPageToShow = $scope.pages.length % $scope.limitTo;
					var start = $scope.pages.length-totalPageToShow;
					var end = $scope.pages.length;

					showOrHidePage(start, end, "show");
					showOrHidePage(0, start, "hide");
					$scope.currentPage = $scope.pages.length-1;
					$scope.data.offset = $scope.data.limit * $scope.currentPage;
					$scope.showPageBeforeSymbol = true;
					$scope.showNextPageSymbol = false;
				}
				$rootScope.$broadcast('requestFetchData');
			}

			$scope.goToNextPage = function() {
				$scope.currentPage += 1;
				$scope.data.offset = $scope.data.limit * $scope.currentPage;

				if($scope.currentPage % $scope.limitTo == 0) {
					$scope.showPageBeforeSymbol = true;

					var startHide = $scope.currentPage - $scope.limitTo;
					var endHide = $scope.currentPage;
					showOrHidePage(startHide, endHide, "hide");

					var startShow = $scope.currentPage;
					var endShow = 0;
					if($scope.currentPage + $scope.limitTo < $scope.pages.length){
						$scope.showNextPageSymbol = true;
						endShow = $scope.currentPage + $scope.limitTo;
					}
					else{
						$scope.showNextPageSymbol = false;
						endShow = $scope.pages.length;
					}
					showOrHidePage(startShow, endShow, "show");
				}
				$rootScope.$broadcast('requestFetchData');
			}

			$scope.goToPreviousPage = function() {

				if($scope.currentPage % $scope.limitTo == 0) {
					var startHide = $scope.currentPage;
					var endHide = $scope.pages.length;
					showOrHidePage(startHide, endHide, "hide");

					var startShow = $scope.currentPage - $scope.limitTo;
					var endShow = $scope.currentPage;
					showOrHidePage(startShow, endShow, "show");

					$scope.showNextPageSymbol = true;
					if($scope.currentPage - $scope.limitTo == 0) $scope.showPageBeforeSymbol = false;
				}
				$scope.currentPage -= 1;
				$scope.data.offset = 0;
				$scope.data.offset = $scope.data.offset + ($scope.data.limit * ($scope.currentPage));
				$rootScope.$broadcast('requestFetchData');
			}

			$rootScope.$on('requestPaginationUpdate', function() {
				$scope.updatePages();
				$scope.goToPage(0);
			})

		}
	}
}
