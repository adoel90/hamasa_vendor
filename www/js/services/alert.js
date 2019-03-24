distributionApp.factory('$modalService', function($uibModal, $q) {
	'use strict';

	return {
		open: function(opts) {
			var deferred = $q.defer();

			var defaultOptions = {
                animation: true,
                backdrop: 'static'
			}

			var options = angular.extend({}, defaultOptions, opts);

			$uibModal.open(options).opened.then(function(response) {
				deferred.resolve(response);
			});

			return deferred.promise;

		}
	}
})
