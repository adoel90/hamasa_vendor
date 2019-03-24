distributionApp.factory('$authorizationService', function($myCookies) {
  var accessToken = $myCookies.get("accessToken");
  return{
    delete: {
      rejectAuth: function(data){
        return $.ajax({
          url: api.url + "auth/reject?accessToken=" + $myCookies.get('accessToken'),
          method: 'DELETE',
          data: data
        })
      }
    }
  }
});
