distributionApp.factory('$supplierService', function($myCookies){
    var accessToken = $myCookies.get('accessToken');

    return {
        get: {
            supplier : function(data){
                return $.get(api.url+'supplier/list?accessToken='+ accessToken +'&limit='+data.limit+'&offset='+data.offset+'&id='+data.id+'&name='+data.name);
            },
            allSuppliers: function(){
                return $.get(api.url+'supplier/all?accessToken=' + accessToken);
            },
            detailSupplier: function(id){
                return $.get(api.url+'supplier/detail?accessToken=' + accessToken+'&id='+id);
            },
            supplierType: function(){
                return $.get(api.url + 'supplier/type?accessToken=' + accessToken);
            },
        },
        post: {
            newSupplier : function(data){
                return $.ajax({
                    url: api.url+'supplier/create?accessToken=' + accessToken,
                    method: 'POST',
                    data: data
                })
            }
        },
        put: {
            detailSupplier : function(data){
                return $.ajax({
                    url: api.url+'supplier/update?accessToken='+$myCookies.get('accessToken'),
                    method: 'PUT',
                    data: data
                })
            }
        },
        delete: {
           deleteSupplier: function(data){
             return $.ajax({
                url: api.url+'supplier/delete?accessToken='+$myCookies.get('accessToken'),
                method: 'DELETE',
                data: data
             })
          }
        }
    }
})
