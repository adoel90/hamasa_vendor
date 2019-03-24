distributionApp.factory('$categoryService', function($myCookies){
   var accessToken = $myCookies.get('accessToken');
   return{
      post: {
         createCategoryMaster: function(data){
            return $.ajax({
               url: api.url+'item/category/create?accessToken='+accessToken,
               method: 'POST',
               data: data
            })
         }
      },
      get: {
         allCategory: function(){
            return $.get(api.url+'item/category/all?accessToken='+accessToken);
         },
         listCategoryMaster: function(data){
            return $.get(api.url+'item/category/list?accessToken='+accessToken+'&limit='+data.limit+'&offset='+data.offset+'&name='+data.name);
         },
         categoryDetail: function(id){
            return $.get(api.url+'item/category/detail?accessToken='+accessToken+'&id='+id);
         }
      },
      put: {
         updateCategoryMaster: function(data){
            return $.ajax({
               url: api.url+'item/category/update?accessToken='+accessToken,
               method: 'PUT',
               data: data
            })
         }
      },
      delete: {
         categoryMaster: function(data){
            return $.ajax({
               url: api.url+'item/category/delete?accessToken='+accessToken,
               method: 'DELETE',
               data: data
            })
         }
      }
   }
});
