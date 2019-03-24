distributionApp.factory('$invoiceService', function($myCookies){
	var accessToken = $myCookies.get('accessToken');

	return {
		get : {
			invoiceDetail: function(invoice) {
				return $.get(api.url + 'invoice/detail?accessToken=' + accessToken + '&id=' + invoice.id + "&change=" + invoice.change)
			},
			printInvoice: function(data){
				return $.get(api.url + 'invoice/print?accessToken=' + accessToken + '&id=' + data.id + "&change=" + data.change);
			},
			invoiceListBasedOnSupplier: function(supplierId){
				return $.get(api.url + 'supplier/invoice?accessToken=' + accessToken + '&supplier=' + supplierId);
			},
			invoiceTax: function(invoiceId){
				return $.get(api.url + 'invoice/tax?accessToken=' + accessToken + '&inv_id=' + invoiceId);
			}
		},
		put: {
			//tax and invoice date
			updateInvoice: function(invoice){
				return $.ajax({
                    url: api.url + 'invoice/update?accessToken=' + accessToken,
                    method: 'PUT',
                    data: invoice
                })
			},
			//tujuannya apabila ada kesalahan pada data customer baik nama maup
			generateInvoiceReplacement: function(data){
				return $.ajax({
					url: api.url + 'invoice/replacement?accessToken=' + accessToken,
					method: 'PUT',
					data: data
				})
			}
		},
		redirect: {
			printInvoice: function(data) {
				var url = api.url + 'invoice/print?accessToken=' + accessToken + '&id=' + data.id + '&change=' + data.change;
				return window.open(url, '_blank');
			}
		}
	}
});
