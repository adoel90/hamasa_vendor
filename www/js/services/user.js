distributionApp.factory('$userService', function($myCookies){
   return{
      get : {
         listUser : function(data){
            return $.get(api.url+'user/list?accessToken='+$myCookies.get('accessToken')+'&limit='+data.limit+'&offset='+data.offset+'&name='+data.name);
         },
         listAccess : function(){
            return $.get(api.url+'access/list?accessToken='+$myCookies.get('accessToken'));
         },
         userNotifications: function(data){
           return $.get(api.url + 'user/notification?accessToken=' + $myCookies.get('accessToken') + '&limit=' + data.limit + '&offset=' + data.offset);
         },
         unreadNotifications: function(){
           return $.get(api.url + 'user/notification/unread?accessToken=' + $myCookies.get('accessToken'));
         },
         userDetail: function(id){
           return $.get(api.url + 'user/detail?accessToken=' + $myCookies.get('accessToken') + '&id=' + id);
         }
      },
      post : {
         createUser : function(data){
            return $.ajax({
               url: api.url+'user/create?accessToken='+$myCookies.get('accessToken'),
               method: 'POST',
               data: data
            })
         }
      },
      put : {
         resetUserPassword : function(data){
            return $.ajax({
               url: api.url+'user/reset_password?accessToken='+$myCookies.get('accessToken'),
               method: 'PUT',
               data: data
            });
         },
         updateUserProfileAndAccessLevel : function(data){
            return $.ajax({
               url: api.url+'user/update?accessToken='+$myCookies.get('accessToken'),
               method: 'PUT',
               data: data
            });
         },
         updateProfile: function(data){
            return $.ajax({
               url: api.url+'user/update_profile?accessToken='+$myCookies.get('accessToken'),
               method: 'PUT',
               data: data
            });
         }
      }
   }
})
