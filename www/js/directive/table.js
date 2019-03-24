distributionApp
	.directive('table', table);

function table() {
	return {
		restrict: 'EA',
		link: function($scope, element, attrs) {
			$scope.setTableHeadingSize = function(heading) {
				switch(heading.size) {
					case 'sm': {
						return 'small';
					}
					case 'lg': {
						return 'large';
					}
				}
			}
		}
	}
}
