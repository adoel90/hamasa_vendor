distributionApp.factory('$modalService', function($uibModal, $uibModalStack, $q) {
	'use strict';

	return {
		open: function(opts) {
			var deferred = $q.defer();

			var defaultOptions = {
                animation: true
			}

			var options = angular.extend({}, defaultOptions, opts);

			$uibModal.open(options).opened.then(function(response) {
				deferred.resolve(response);
			});

			return deferred.promise;

		},
		alert: function(opts) {
			var deferred = $q.defer();
			var defaultOptions = {
				animation: true,
				backdrop: 'static',
				templateUrl: '/dist/view/alert/alert.html',
				keyboard: false
			}

			var options = angular.extend({}, defaultOptions, opts);

			$uibModal.open(options).opened.then(function(response) {
				deferred.resolve(response);
			})

			return deferred.promise;
		},
		close: function() {
			$uibModalStack.dismissAll();
		}
	}
})
