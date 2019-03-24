distributionApp.factory('$paymentService', function($myCookies) {
   var accessToken = $myCookies.get('accessToken');
   return{
      get: {
         paymentList: function(data){
            return $.get(api.url + 'payment/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&invoice=' + data.invoice + '&customer_name=' + data.customer_name + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
         },
				 paymentProof: function(data) {
	 				return $.get(api.url + 'payment/proof?accessToken=' + accessToken + '&proof=' + data.proof)
				},
         paymentDetail: function(id){
            return $.get(api.url + 'payment/detail?accessToken=' + accessToken + '&id=' + id);
         },
         customerInvoice: function(id){
            return $.get(api.url + 'customer/invoice?accessToken=' + accessToken + '&id=' + id);
         },
         poPaymentList: function(data){
           return $.get(api.url + 'payment/purchase/order/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&supplier=' + data.supplier + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
         },
         poPaymentDetail: function(id){
           return $.get(api.url + 'payment/purchase/order/detail?accessToken=' + accessToken + '&id=' + id);
         }
      },
      post: {
         createPayment: function(data){
            return $.ajax({
               url: api.url+'payment/create?accessToken='+accessToken,
               method: 'POST',
               data: data
            })
         },
				 settleDisbursement: function(data) {
	 				return $.ajax({
	 					url: api.url + 'payment/disbursement?accessToken=' + accessToken,
	 					method: 'POST',
	 					data: data
	 				})
	 			},
        createPaymentForPo: function(data){
          return $.ajax({
            url: api.url + 'payment/purchase/order/create?accessToken=' + accessToken,
            method: 'POST',
            data: data
          })
        }
      }
   }
});
