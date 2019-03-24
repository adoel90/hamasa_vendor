distributionApp
	.directive('datePicker', datePicker)

function datePicker() {
	return {
		restrict: 'EA',
		link: function($scope, element, attrs) {
		}
	}
}