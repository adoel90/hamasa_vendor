distributionApp.factory('$itemService', function($myCookies){
    var accessToken = $myCookies.get('accessToken');

    return {
        get : {
            itemList : function(data){
                return $.get(api.url+'item/list?accessToken='+ accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&name=' + data.name + '&category=' + data.category + '&supplier=' + data.supplier + '&id=' + data.id + '&grade=' + data.grade);
            },
            itemDetail: function(id) {
                return $.get(api.url + 'item/detail?accessToken=' + accessToken + '&ig_id=' + id)
            },
            priceList: function(data){
               return $.get(api.url + 'price/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&name=' + data.name + '&category=' + data.category + '&supplier=' + data.supplier + '&id=' + data.id + '&grade=' + data.grade);
            },
            allItemByCategory: function(id){
              return $.get(api.url + "item/category?accessToken=" + accessToken + "&id=" + id);
            },
            itemHistory: function(id){
              return $.get(api.url + 'item/history?accessToken=' + accessToken + '&ig_id=' + id);
            }
        },
        post: {
            addItem : function(data){
                return $.ajax({
                    url: api.url+'item/create?accessToken='+ accessToken,
                    method: 'POST',
                    data: data
                });
            },
            importPriceListDoc: function(data){
               var formData = new FormData();
               formData.append('file', data);

               return $.ajax({
                  url: api.url + 'price/list/import?accessToken='+accessToken,
                  method: 'POST',
                  data: formData,
                  processData: false,
                  contentType: false
               });
            },
            importCoil: function(data){
              var formData = new FormData();
              formData.append('file', data);

              return $.ajax({
                url: api.url + 'item/coil/import?accessToken=' + accessToken,
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false
              })
            },
            createItemCut: function(data){
              return $.ajax({
                url: api.url + 'sales/order/cut?accessToken=' + accessToken,
                method: 'POST',
                data: data
              })
            }
        },
        put: {
            updateItem: function(data) {
                return $.ajax({
                    url: api.url + 'item/update?accessToken=' + accessToken,
                    method: 'PUT',
                    data: data
                })
            },
            updatePriceMaster: function(data){
               return $.ajax({
                  url: api.url+'price/update?accessToken='+accessToken,
                  method: 'PUT',
                  data: data
               })
            }
        },
        delete: {
            deleteItem: function(data) {
                return $.ajax({
                    url: api.url + 'item/delete?accessToken=' + accessToken,
                    method: 'DELETE',
                    data: data
                })
            }
        }
    }
})
