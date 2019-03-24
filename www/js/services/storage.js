distributionApp.factory('$myStorage', function($window, $parse){
   return{
      getObject : function(name){
         return $parse($window.localStorage[name])();
      },
      putObject : function(name, data){
         return $window.localStorage[name] = JSON.stringify(data);
      },
      put : function(name, data){
         return $window.localStorage[name] = data;
      },
      get : function(name){
         return $window.localStorage[name];
      },
      remove : function(name){
         delete $window.localStorage[name];
      }
   }
})
