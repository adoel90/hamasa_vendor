distributionApp
	.service('$cashService', cashService);

function cashService($myCookies) {
	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			cashoutList: function(data) {
				return $.get(api.url + 'cash/out/list?accessToken=' + accessToken
					+ '&limit=' + data.limit
					+ '&offset=' + data.offset
					+ '&id=' + data.id
					+ '&date=' + data.date
					+ '&s_date=' + data.s_date
					+ '&e_date=' + data.e_date
				);
			},
			cashoutDetail: function(id) {
				return $.get(api.url + 'cash/out/detail?accessToken=' + accessToken + '&id=' + id);
			},
			cashinList: function(data){
				return $.get(api.url + 'cash/in/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&date=' + data.date + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
			},
			cashinDetail: function(id){
				return $.get(api.url + 'cash/in/detail?accessToken=' + accessToken + '&id=' + id);
			}
		},
		post: {
			createCashout: function(data) {
				return $.ajax({
					url: api.url + 'cash/out/create?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			},
			createCashin: function(data){
				return $.ajax({
					url: api.url + 'cash/in/create?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			}
		}
	}
}
