distributionApp.factory('$transactionService', function($myCookies){

   return{
      
      get : {
         listBTB : function(data){
            return $.get(api.url+'btb/list?accessToken='+$myCookies.get('accessToken')+'&limit='+data.limit+'&offset='+data.offset+'&id='+data.id+'&from='+data.from+'&date='+data.date);
         },
         detailBTB : function(id){
            return $.get(api.url+'btb/detail?accessToken='+$myCookies.get('accessToken')+'&id='+id);
         },
         listBKB : function(data){
            return $.get(api.url+'bkb/list?accessToken='+$myCookies.get('accessToken')+'&limit='+data.limit+'&offset='+data.offset+'&id='+data.id+'&date='+data.date+'&do_id='+data.do_id+'&c_name='+data.c_name);
         },
         listMutation : function(data){
            return $.get(api.url+'mutation/list?accessToken='+$myCookies.get('accessToken')+'&limit='+data.limit+'&offset='+data.offset+'&do='+data.do);
         },
         detailPO : function(id){
            return $.get(api.url+'purchase/order/detail?accessToken='+$myCookies.get('accessToken')+'&id='+id);
         },
         detailDO : function(id){
            return $.get(api.url+'do/detail?accessToken='+$myCookies.get('accessToken')+'&id='+id);
         },
         detailMutation : function(id){
            return $.get(api.url+'mutation/detail?accessToken='+$myCookies.get('accessToken')+'&id='+id);
         }
      },
      post : {
         createBTB : function(data){
            return $.ajax({
               url: api.url+'btb/create?accessToken='+$myCookies.get('accessToken'),
               method: 'POST',
               data: data
            })
         },
         createBKB : function(data){
            return $.ajax({
               url: api.url+'bkb/create?accessToken='+$myCookies.get('accessToken'),
               method: 'POST',
               data: data
            })
         },
         createMutation : function(data){
            return $.ajax({
               url: api.url+'mutation/create?accessToken='+$myCookies.get('accessToken'),
               method: 'POST',
               data: data
            })
         }
      }
   }
})
