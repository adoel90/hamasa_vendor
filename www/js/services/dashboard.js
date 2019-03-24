distributionApp.factory('$dashboardService', function($myCookies){
  var accessToken = $myCookies.get('accessToken');

  return {
    get : {
      salesIncome: function(){
        return $.get(api.url + "dashboard/sales/income?accessToken=" + accessToken);
      },
      salesOrder: function(){
        return $.get(api.url + "dashboard/sales/order?accessToken=" + accessToken);
      },
      salesQuotation: function(){
        return $.get(api.url + "dashboard/sales/quotation?accessToken=" + accessToken);
      },
      salesQuotationRealization: function(){
        return $.get(api.url + "dashboard/sales/quotation/realization?accessToken=" + accessToken);
      },
      purchase: function(){
        return $.get(api.url + "dashboard/purchase?accessToken=" + accessToken);
      },
      revenue: function(){
        return $.get(api.url + "dashboard/revenue?accessToken=" + accessToken);
      },
      cashout: function(){
        return $.get(api.url + "dashboard/cash/out?accessToken=" + accessToken);
      }
    }
  }
})
