distributionApp.factory('$myCookies', function($cookies){
   var currentDate = new Date();
   var date = currentDate.getDate()+1;
   var month = currentDate.getMonth()+1;
   var year = currentDate.getFullYear();
   var tomorrowDate = year+'-'+month+'-'+date;

   return{
      getObject : function(name){
         return $cookies.getObject(name);
      },
      putObject : function(name, data){
         $cookies.putObject(name, data, {
            'expires': new Date(tomorrowDate)
         });
      },
      put : function(name, data){
         $cookies.put(name, data, {
            'expires': new Date(tomorrowDate)
         });
      },
      get : function(name){
         return $cookies.get(name);
      },
      delete : function(name){
         $cookies.remove(name);
      }
   }
})
