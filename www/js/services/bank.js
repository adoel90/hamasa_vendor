distributionApp.factory('$bankService', function($myCookies) {
  var accessToken = $myCookies.get('accessToken');
  return {
    get : {
      allBank: function(){
        return $.get(api.url + "bank/all?accessToken=" + accessToken);
      },
      bankList : function(data){
        return $.get(api.url + "bank/list?accessToken=" + accessToken + "&limit=" + data.limit + "&offset=" + data.offset);
      },
      bankDetail: function(account){
        return $.get(api.url + "bank/detail?accessToken=" + accessToken + "&account=" + account);
      }
    },
    put: {
      updateBank: function(data){
        return $.ajax({
          url: api.url + "bank/update?accessToken=" + accessToken,
          method: "PUT",
          data: data
        })
      }
    },
    post: {
      createBank : function(data){
        return $.ajax({
          url: api.url + 'bank/create?accessToken=' +accessToken,
          method: "POST",
          data: data
        })
      }
    },
    delete: {
      bank : function(data){
        return $.ajax({
          url: api.url + "bank/delete?accessToken=" + accessToken,
          method: "DELETE",
          data: data
        })
      }
    }
  }
});
