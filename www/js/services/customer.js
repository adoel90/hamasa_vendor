distributionApp.factory('$customerService', function($myCookies){
    var accessToken = $myCookies.get('accessToken');

    return {
        get: {
            customer: function() {
                return $.get(api.url + 'customer/all?accessToken=' + accessToken);
            },
            customerList: function(data) {
                return $.get(api.url+'customer/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&customer_id=' + data.id + '&customer_name=' + data.name);
            },
            listCustomerAddress: function(data){
               return $.get(api.url+'customer/address?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id);
            },
            customerDetail: function(id) {
                return $.get(api.url + 'customer/detail?accessToken=' + accessToken + '&id=' + id);
            },
            customerType: function(){
                return $.get(api.url + 'customer/type?accessToken=' + accessToken);
            },
            customerRegion: function(){
              return $.get(api.url + 'customer/region?accessToken=' + accessToken);
            }
        },
        post: {
            createCustomer: function(data) {
                return $.ajax({
                    url: api.url + 'customer/create?accessToken=' + accessToken,
                    method: 'POST',
                    data: data
                })
            }
        },
        put: {
            updateCustomer: function(data) {
                return $.ajax({
                    url: api.url + 'customer/update?accessToken=' + accessToken,
                    method: 'PUT',
                    data: data
                })
            }
        },
        delete: {
            deleteCustomer: function(data) {
                return $.ajax({
                    url: api.url + 'customer/delete?accessToken=' + accessToken,
                    method: 'DELETE',
                    data: data
                })
            }
        }
    }
})
