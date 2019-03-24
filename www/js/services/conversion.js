distributionApp.service('$conversionService', function($myCookies) {
	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			conversionList: function(data) {
				return $.get(api.url + 'conversion/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&warehouse=' + data.warehouse + '&item_id=' + data.item_id + '&item_name=' + data.item_name + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
			},
			conversionDetail: function(id) {
				return $.get(api.url + 'conversion/detail?accessToken=' + accessToken + '&id=' + id);
			}
		},
		post: {
			createConversion: function(data) {
				return $.ajax({
					url: api.url + 'conversion/create?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			}
		}
	}
})
