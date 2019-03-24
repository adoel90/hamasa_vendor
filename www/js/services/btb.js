distributionApp.factory('$btbService', function($myCookies) {
	'use strict';


	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			btbList: function(data) {
				return $.get(api.url + 'btb/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&from=' + data.from + '&date=' + data.date + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
			},
			btbDetail: function(id) {
				return $.get(api.url + 'btb/detail?accessToken=' + accessToken + '&id=' + id)
			}
		},
		post: {
			createBtb: function(data) {
				return $.ajax({
					url: api.url + 'btb/create?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			}
		}
	}
});
