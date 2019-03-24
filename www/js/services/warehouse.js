distributionApp.factory('$warehouseService', function($myCookies){
    var accessToken = $myCookies.get('accessToken');

    return {
        post : {
            addWarehouse: function(data){
                return $.ajax({
                    url: api.url + 'warehouse/create?accessToken=' + accessToken,
                    method: 'POST',
                    data: data
                })
            }
        },
        get : {
            warehouse: function() {
                return $.get(api.url + 'warehouse/all?accessToken=' + accessToken);
            },
            warehouseList : function(data){
                return $.get(api.url+ 'warehouse/list?accessToken='+ accessToken +'&limit='+data.limit+'&offset='+data.offset+'&id='+data.id+'&name='+data.name);
            },
            warehouseDetail: function(id) {
                return $.get(api.url + 'warehouse/detail?accessToken=' + accessToken + '&id=' + id);
            },
            warehouseItem: function(data) {
                return $.get(api.url + 'warehouse/item?accessToken=' + accessToken + '&warehouse_id=' + data.warehouse_id + '&limit=' + data.limit + '&offset=' + data.offset + '&category=' + data.category  + '&name=' + data.name + '&item_id=' + data.item_id);
            }
        },
        put : {
            updateWarehouse : function(data){
                return $.ajax({
                    url: api.url+'warehouse/update?accessToken='+$myCookies.get('accessToken'),
                    method: 'PUT',
                    data: data
                })
            }
        },
        delete : {
            deleteWarehouse : function(data){
                return $.ajax({
                    url: api.url+'warehouse/delete?accessToken=' + accessToken,
                    method: 'DELETE',
                    data: data
                })
            }
        }
    }
})
