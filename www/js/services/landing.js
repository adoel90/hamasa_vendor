distributionApp.factory('$landingService', function(){
   return{
      login: function(data){
         return $.ajax({
            url: api.url+'user/login',
            method: 'POST',
            data: data
         });
      }
   }
})
