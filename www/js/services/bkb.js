distributionApp.factory('$bkbService', function($myCookies) {
	'use strict';

	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			bkbList: function(data) {
				return $.get(api.url + 'bkb/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&do_id=' + data.do_id + '&date=' + data.date + '&c_name=' + data.c_name + "&s_date=" + data.s_date + "&e_date=" + data.e_date);
			},
			bkbDetail: function(id) {
				return $.get(api.url + 'bkb/detail?accessToken=' + accessToken + '&id=' + id);
			}
		},
		post: {
			createBkb: function(data) {
				return $.ajax({
					url: api.url + 'bkb/create?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			}
		}
	}
});
