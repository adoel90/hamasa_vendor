distributionApp.factory('$inventoryService', function($myCookies){
  var accessToken = $myCookies.get('accessToken');

  return {
    get : {
      warehouseInventoryList: function(data) {
        return $.get(api.url + 'inventory/warehouse?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&warehouse=' + data.warehouse + '&item_name=' + data.item_name + '&category=' + data.category + '&item_id=' + data.item_id);
      },
      inventoryAuthList: function(data){
        return $.get(api.url + 'inventory/auth/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&date=' + data.date);
      },
      inventoryAuthDetail: function(auth_id){
        return $.get(api.url + 'inventory/auth/detail?accessToken=' + accessToken + '&auth_id=' + auth_id);
      }
    },
    put: {
      updateInventory: function(data) {
        return $.ajax({
          url: api.url + 'inventory/update?accessToken=' + accessToken,
          method: 'PUT',
          data: data
        })
      },
      adjustInventory: function(data) {
        return $.ajax({
          url: api.url + 'inventory/adjust?accessToken=' + accessToken,
          method: 'PUT',
          data: data
        })
      }
    },
    post: {
      approveInventoryAdjustment: function(data){
        return $.ajax({
          url: api.url + 'inventory/adjust/approve?accessToken=' + accessToken,
          method: 'POST',
          data: data
        })
      }
    },
    delete: {
      rejectAdjustItemIventory: function(data){
        return $.ajax({
          url: api.url + 'inventory/auth/reject?accessToken=' + accessToken,
          method: 'DELETE',
          data: data
        })
      }
    }
  }
});
