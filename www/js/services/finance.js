distributionApp.factory('$financeService', function($myCookies){
  var accessToken = $myCookies.get('accessToken');
  return {
    get: {
      financeAuthList: function(data){
        return $.get(api.url + "finance/auth/list?accessToken=" + accessToken + "&limit=" + data.limit + "&offset=" + data.offset + "&date=" + data.date);
      }
    },
    post: {
      approveCustomerCredit: function(data){
        return $.ajax({
          url: api.url + 'customer/credit/approve?accessToken=' + accessToken,
          method: 'POST',
          data: data
        })
      }
    },
    delete: {
      rejectForFinanceAuth: function(data){
        return $.ajax({
          url: api.url + 'auth/reject?accessToken=' + accessToken,
          method: 'DELETE',
          data: data
        })
      }
    }
  }
});
