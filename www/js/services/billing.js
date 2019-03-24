distributionApp
	.service('$billingService', billingService);

function billingService($myCookies) {
	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			billingList: function(data) {
				return $.get(api.url + 'billing/list?accessToken=' + accessToken + "&print=" + data.print + "&date=" + data.date + "&region=" + data.region);
			},
			billingDetail: function(invoice_id) {
				return $.get(api.url + 'billing/detail?accessToken=' + accessToken + '&invoice=' + invoice_id)
			}
		},
		post: {
			updateBilling: function(data) {
				return $.ajax({
					url: `${api.url}billing/update?accessToken=${accessToken}`,
					method: 'POST',
					data: data
				})
			}
		}
	}
}
