distributionApp.factory('$deliveryService', function($myCookies){
   var accessToken = $myCookies.get('accessToken');
   return{
      get: {
         listPriceDelivery: function(data){
            return $.get(api.url+'delivery/price/list?accessToken='+accessToken+'&limit='+data.limit+'&offset='+data.offset+'&name='+data.name+'&capacity='+data.capacity);
         },
         detailPriceDelivery: function(id){
            return $.get(api.url+'delivery/price/detail?accessToken='+accessToken+'&id='+id);
         },
         deliveryDetailInvoice: function(id){
            return $.get(api.url+'sales/order/delivery/detail?accessToken='+accessToken+'&id='+id);
         }
      },
      post : {
         createPriceDelivery: function(data){
            return $.ajax({
               url: api.url+'delivery/price/create?accessToken='+accessToken,
               method: 'POST',
               data: data
            })
         },
         createDoDelivery: function(data){
            return $.ajax({
               url: api.url+'delivery/create?accessToken='+accessToken,
               method: 'POST',
               data: data
            })
         }
      },
      put : {
         updatePriceDelivery: function(data){
            return $.ajax({
               url: api.url+'delivery/price/update?accessToken='+accessToken,
               method: 'PUT',
               data: data
            })
         }
      },
      delete : {
         deletePriceDelivery: function(data){
            return $.ajax({
               url: api.url+'delivery/price/delete?accessToken='+accessToken,
               method: 'DELETE',
               data: data
            })
         }
      }

   }
});
