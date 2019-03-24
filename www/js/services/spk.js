distributionApp.service('$spkService', function($myCookies) {
   var accessToken = $myCookies.get('accessToken');

   return{
      get : {
         listSpk : function(data){
            return $.get(api.url+'spk/list?accessToken='+accessToken+'&limit='+data.limit+'&offset='+data.offset+'&id='+data.id+'&date='+data.date+'&customer='+data.customer+'&s_date='+data.s_date+'&e_date='+data.e_date);
         },
         detailSpk : function(id){
            return $.get(api.url+'spk/detail?accessToken='+accessToken+'&id='+id);
         },
         customerDataBySoNumb : function(id){
            return $.get(api.url+'tipo/sales/order/detail?accessToken='+accessToken+'&so_id='+id);
         },
         itemListForSpk : function(id){
            return $.get(api.url+'tipo/item?accessToken='+accessToken+'&so_id='+id);
         },
         itemListForSpkResult : function(data){
            return $.get(api.url+'item/list?accessToken='+accessToken+'&limit='+data.limit+'&offset='+data.offset+'&name='+data.name+'&category='+data.category+'&supplier='+data.supplier);
         }
      },
      post : {
         createSpk : function(data){
            return $.ajax({
               url: api.url+'spk/create?accessToken='+accessToken,
               method: 'POST',
               data: data
            })
         },
         createSpkReport: function(data){
           return $.ajax({
              url: api.url+'spk/report?accessToken='+accessToken,
              method: 'POST',
              data: data
           })
         }
      }
   }
});
