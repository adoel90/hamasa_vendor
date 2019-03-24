distributionApp.factory('$salesService', function($myCookies){
	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			salesAuthList: function(data){
        		return $.get(api.url + 'sales/auth/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&date=' + data.date);
      		},
			contractList: function(data) {
				return $.get(api.url + 'sales/contract/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&contract_id=' + data.contract_id + '&customer_name=' + data.customer_name + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
			},
			contractDetail: function(id) {
				return $.get(api.url + 'sales/contract/detail?accessToken=' + accessToken + '&id=' + id);
			},
			contractHistory: function(data) {
				return $.get(api.url + 'sales/contract/history?accessToken=' + accessToken + '&id=' + data.id + '&history_limit=' + data.history_limit);
			},
			salesContractDetail: function(id){
				return $.get(api.url + 'sales/contract/detail?accessToken=' + accessToken + '&id=' + id);
			},
			salesOrderList: function(data) {
				return $.get(api.url + 'sales/order/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&date=' + data.date + '&customer_name=' + data.customer_name + '&sales_name=' + data.sales_name + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
			},
			salesOrderInfo: function(id) {
				return $.get(api.url + 'sales/order/info?accessToken=' + accessToken + '&id=' + id)
			},
			salesOrderItemDetail: function(so_id, warehouse_id) {
				return $.get(api.url + 'sales/order/item/detail?accessToken=' + accessToken + '&id=' + so_id + '&warehouse_id=' + warehouse_id);
			},
			salesOrderDetail: function(id) {
				return $.get(api.url + 'sales/order/detail?accessToken=' + accessToken + '&id=' + id)
			},
			salesOrderInvoiceDetail: function(id) {
				return $.get(api.url+  'sales/order/invoice?accessToken=' + accessToken + '&id=' + id)
			},
			priceList: function(data) {
				return $.get(api.url + 'sales/price?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&pay_method=' + data.pay_method + '&pickup=' + data.pickup + '&contract_id=' + data.contract_id +
				'&name=' + data.name + '&category=' + data.category + '&id=' + data.id + '&supplier=' + data.supplier + '&grade=' + data.grade);
			},
			priceAuthDetail: function(id){
				return $.get(api.url + 'price/auth/detail?accessToken=' + accessToken + '&id='+id);
			},
			salesOrderCutDetail: function(id){
				return $.get(api.url + 'sales/order/cut/detail?accessToken=' + accessToken + '&id=' + id);
			}
		},
		post: {
			createContract: function(data) {
				return $.ajax({
					url: api.url + 'sales/contract/create?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			},
			createSalesOrder: function(data) {
				return $.ajax({
					headers : {
						"content-type" : "application/json"
					},
					url: api.url + 'sales/order/create?accessToken=' + accessToken,
					method: 'POST',
					data: JSON.stringify(data)
				})
			},
			approveSoDetail: function(data){
        return $.ajax({
          url: api.url + 'sales/order/approve?accessToken=' + accessToken,
          method: 'POST',
          data: data
        });
      },
			approveSoDetailCancelation: function(data){
				return $.ajax({
					url: api.url + 'sales/order/cancel/approve?accessToken=' + accessToken,
					method: 'POST',
					data: data
				})
			},
			approveSalesContractCancelation: function(data){
				return $.ajax({
					url: api.url + 'sales/contract/cancel/approve?accessToken=' +accessToken,
					method: 'POST',
					data: data
				})
			}
		},
		put: {
			amandemenContract: function(data){
				return $.ajax({
					url: api.url + 'sales/contract/amandemen?accessToken=' + accessToken,
					method: 'PUT',
					data: data
				})
			},
			updateSoByAuthorization: function(data){
				return $.ajax({
					url: api.url + 'sales/order/update?accessToken=' + accessToken,
					method: 'PUT',
					data: data
				})
			},
			approvePriceMasterUpdate: function(data){
				return $.ajax({
					url: api.url + 'price/update/approve?accessToken=' +accessToken,
					method: 'PUT',
					data: data
				})
			}
		},
		delete: {
			cancelContract: function(data) {
				return $.ajax({
					url: api.url + 'sales/contract/cancel?accessToken=' + accessToken,
					method: 'DELETE',
					data: data
				})
			},
			cancelSalesOrder: function(data) {
				return $.ajax({
					url: api.url + 'sales/order/cancel?accessToken=' + accessToken,
					method: 'DELETE',
					data: data
				})
			},
			rejectSalesAuth: function(data){
				return $.ajax({
					url: api.url + 'auth/reject?accessToken=' + accessToken,
					method: 'DELETE',
					data: data
				})
			},
			rejectPriceMasterUpdate: function(data){
				return $.ajax({
					url: api.url + 'auth/reject?accessToken=' + accessToken,
					method: 'DELETE',
					data: data
				})
			},
			closeSalesContract: function(data){
				return $.ajax({
					url: api.url + 'sales/contract/close?accessToken=' + accessToken,
					method: 'DELETE',
					data: data
				})
			}
		}
	}
})
