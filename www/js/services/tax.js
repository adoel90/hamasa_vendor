distributionApp
	.service('$taxService', taxService)

function taxService($myCookies) {
	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			taxSerialList: function(data) {
				return $.get(`${api.url}tax/serial/list?accessToken=${accessToken}&limit=${data.limit}&offset=${data.offset}`);
			}
		},
		post: {
			createTaxSerial: function(data) {
				return $.ajax({
					url: `${api.url}tax/serial/create?accessToken=${accessToken}`,
					method: 'POST',
					data: data
				})
			}
		},
		delete: {
			deleteTax: function(data){
				return $.ajax({
					url: `${api.url}tax/serial/delete?accessToken=${accessToken}`,
					method: 'DELETE',
					data: data
				})
			}
		}
	}
}
