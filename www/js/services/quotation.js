distributionApp.factory('$quotationService', function($myCookies) {
	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			quotationList: function(data) {
				return $.get(api.url + 'quotation/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&date=' + data.date + '&customer_name=' + data.customer_name + '&s_date=' + data.s_date + '&e_date=' + data.e_date)
			},
			quotationDetail: function(id) {
				return $.get(api.url + 'quotation/detail?accessToken=' + accessToken + '&id=' + id)
			}
		},
		post: {
			createQuotation: function(data) {
				return $.ajax({
					url: api.url + 'quotation/create?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			},
			realizeQuotation: function(data) {
				return $.ajax({
					url: api.url + 'quotation/realization?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			}
		}
	}
});
