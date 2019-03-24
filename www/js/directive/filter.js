distributionApp
	.directive('searchFilterBar', searchFilterBar);

function searchFilterBar() {
	return {
		restrict: 'EA',
		scope: {
			filters: '=',
			buttonText: '@',
			buttonHandler: '&',
			searchHandler: '&'
		},
		template: `
			<form class="form">
				<label class="form-label">Cari berdasarkan</label>
				<div class="row">
					<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 pd-right-15">
						<ui-select ng-model="selectedFilter.item" on-change="changeFilter($item)">
							<ui-select-match>
								<span ng-bind="$select.selected.name"></span>
							</ui-select-match>
							<ui-select-choices repeat="filter in (filters | filter: $select.search) track by $index">
								<span ng-bind="filter.name"></span>
							</ui-select-choices>
						</ui-select>
					</div>
					<div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 pd-right-15">
						<div class="input-group">
							<input type="text" class="form-input" ng-model="searchVal" placeholder="{{selectedFilter.item.placeholder}}" />
							<button class="button button--base button--secondary" ng-click="searchHandler(searchVal, selectedFilter.item.by)">Cari</button>
						</div>
					</div>
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
						<div class="flex-column">
							<button type="button" class="button button--base button--primary" ng-click="buttonHandler()">
								{{ buttonText }}
							</button>
						</div>
					</div>
				</div>
			</form>
		`,
		link: function($scope, element, attrs) {

			setInitialFilter();
			function setInitialFilter() {
				$scope.selectedFilter = {
					item: $scope.filters[0]
				}
			}

		}
	}
}
