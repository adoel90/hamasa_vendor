distributionApp.factory('$purchaseService', function($myCookies) {
	var accessToken = $myCookies.get('accessToken');

	return {
		auth: {
			get: {
				purchaseAuthList: function(data){
					return $.get(api.url + 'purchase/auth/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&date=' + data.date);
				}
			},
			post: {
				approveForPoAuth: function(data){
					return $.ajax({
						url: api.url + 'purchase/order/approve?accessToken=' + accessToken,
						method: 'POST',
						data: data
					})
				}
			},
			delete: {
				rejectForPoAuth: function(data){
					return $.ajax({
						url: api.url + 'auth/reject?accessToken=' + accessToken,
						method: 'DELETE',
						data: data
					})
				}
			}
		},
		order: {
			get: {
				purchaseOrderList: function(data){
					return $.get(api.url + 'purchase/order/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' +data.offset + '&id=' +data.id + '&date=' +data.date + '&supplier_name=' +data.supplier_name + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
				},
				purchaseOrderDetail: function(id) {
					return $.get(api.url + 'purchase/order/detail?accessToken=' + accessToken + '&id=' + id);
				},
				purchaseInvoiceList: function(data){
					return $.get(api.url + 'purchase/order/invoice/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&supplier_name=' + data.supplier_name + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
				},
				purchaseOrderBtbHistory: function(id){
					return $.get(api.url + 'purchase/order/history?accessToken=' + accessToken + '&id=' + id);
				},
				purchaseInvoiceDetail: function(id){
					console.log(id);
					return $.get(api.url + 'purchase/order/invoice/detail?accessToken=' + accessToken + '&id=' + id);
				},
				poInvoiceItem: function(data){
					return $.get(api.url + 'purchase/order/invoice/item?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&supplier=' + data.supplierId + '&name=' + data.name + '&category=' + data.category);
				},

				purchaseBPBList: function(data){
					return $.get(api.url + 'purchase/order/bpb/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' +data.offset + '&id=' +data.id + '&date=' +data.date + '&supplier_name=' +data.supplier_name + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
				},
				purchaseBPBDetail : function(){
					return $.get(api.url + 'purchase/order/bpb/detail?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' +data.offset + '&id=' +data.id + '&date=' +data.date + '&supplier_name=' +data.supplier_name + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
				}
			},
			post : {
				createNewPo: function(data){
					return $.ajax({
						url: api.url + 'purchase/order/create?accessToken=' + accessToken,
						method: 'POST',
						data: data
					})
				},
				createPoInvoice: function(data){
					return $.ajax({
						url: api.url + 'purchase/order/invoice/create?accessToken=' + accessToken,
						method: 'POST',
						data: data
					})
				},
				createPoForSoFactory: function(data){
					return $.ajax({
						url: api.url + 'purchase/order/factory/create?accessToken=' + accessToken,
						method: 'POST',
						data: data
					})
				}
			},
			put:{
				updatePoInvoice: function(data){
					return $.ajax({
						url: api.url + 'purchase/order/invoice/update?accessToken=' + accessToken,
						method: 'PUT',
						data: data
					})
				}
			},
			delete: {
				cancelPo: function(data){
					return $.ajax({
						url: api.url + 'purchase/order/cancel?accessToken=' + accessToken,
						method: 'DELETE',
						data: data
					})
				}
			}
		},
		contract: {
			get: {
				purchasingContractList: function(data){
					return $.get(api.url+'purchase/contract/list?accessToken='+accessToken+'&limit='+data.limit+'&offset='+data.offset+'&id='+data.id+'&date='+data.date+'&supplier_name='+data.supplier+'&s_date='+data.s_date+'&e_date='+data.e_date);
				},
				purchasingContractHistory: function(id){
					return $.get(api.url+'purchase/contract/history?accessToken='+accessToken+'&id='+id);
				},
				purchasingContractDetail: function(data){
					return $.get(api.url+'purchase/contract/detail?accessToken='+accessToken+'&limit='+data.limit+'&offset='+data.offset+'&id='+data.id);
				},
				purchaseContractItem: function(data){
					return $.get(api.url+'purchase/contract/item?accessToken='+accessToken+'&limit='+data.limit+'&offset='+data.offset+'&supplier_id='+data.supplier_id+'&name='+data.name+'&category='+data.category);
				}
			},
			post: {
				createNewPurchasingContract: function(data){
					return $.ajax({
						url: api.url+'purchase/contract/create?accessToken='+accessToken,
						data: data,
						method: 'POST'
					})
				}
			},
			put: {
				amandemenPurchaseContract: function(data){
					return $.ajax({
						url: api.url+'purchase/contract/amandemen?accessToken='+accessToken,
						data: data,
						method: 'PUT'
					})
				}
			}
		}
	}
});
