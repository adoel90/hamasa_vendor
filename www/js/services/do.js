distributionApp.factory('$doService', function($myCookies) {

	'use strict';

	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			doDetail: function(id) {
				return $.get(api.url + 'do/detail?accessToken=' + accessToken + '&do_id=' + id);
			},
			validatePrintDo: function(id){
				return $.get(api.url + 'do/print/validate?accessToken=' + accessToken + '&id=' + id);
			},
			printDo: function(id){
				return $.get(api.url + 'do/print?accessToken=' + accessToken + '&id=' +id);
			},
		},
		post: {
			createDo: function(data) {
				return $.ajax({
					url: api.url + 'do/create?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			},
			acceptReprintDo: function(data){
				return $.ajax({
					url: api.url + 'do/print/approve?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			},
			doResume: function(data){
				return $.ajax({
					url: api.url + 'do/resume?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			}
		},
		delete: {
			cancelDo: function(data){
				return $.ajax({
					url: api.url + 'do/cancel?accessToken=' + accessToken,
					method: 'DELETE',
					data: data
				})
			}
		}
	}
});
