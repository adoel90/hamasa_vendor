distributionApp.factory('$tipoService', function($myCookies){
    
    var accessToken = $myCookies.get('accessToken');

    return {
        get: {
            tipoList: function(data) {
                return $.get(api.url + 'tipo/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&date=' + data.date + '&customer=' + data.customer + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
            },
            tipoInfo: function(id) {
                return $.get(api.url + 'tipo/info?accessToken=' + accessToken + '&id=' + id);
            },
            tipoDetail: function(id){
                return $.get(api.url + 'tipo/detail?accessToken=' + accessToken + '&id=' + id);
            },
            salesOrderTipoList: function(data) {
                return $.get(api.url + 'tipo/sales/order/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&date=' + data.date + '&customer_name=' + data.customer_name + '&sales_name=' + data.sales_name)
            },
            salesOrderTipoDetail: function(so_id, detail) {
                return $.get(api.url + 'tipo/sales/order/detail?accessToken=' + accessToken + '&so_id=' + so_id + '&detail=' + detail);
            },
            listBtbTipo: function(data){
               return $.get(api.url+'tipo/list?accessToken='+accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&date=' +data.date + '&customer='+data.customer + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
            },
            detailBtbTipo: function(id){
               return $.get(api.url+'tipo/detail?accessToken='+accessToken+'&id='+id);
            },
            detailDo: function(id){
               return $.get(api.url+'tipo/do/detail?accessToken='+accessToken+'&id='+id);
            },
            doTipoDetail: function(id) {
                return $.get(api.url + 'tipo/do/detail?accessToken=' + accessToken + '&id=' + id);
            },
            listBkbTipo: function(data){
               return $.ajax(api.url + 'tipo/bkb/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&id=' + data.id + '&date=' + data.date + '&customer=' + data.customer + '&s_date=' + data.s_date + '&e_date=' + data.e_date);
            },
			detailBkbTipo: function(id){
			   return $.get(api.url+'tipo/bkb/detail?accessToken='+accessToken+'&id='+id);
			}
		},
    post: {
        createDoTipo: function(data) {
            return $.ajax({
                url: api.url + 'tipo/do/create?accessToken=' + accessToken,
                method: 'POST',
                data: data
            })
        },
        createBkbTipo: function(data){
           return $.ajax({
              url: api.url+'tipo/bkb/create?accessToken='+accessToken,
              method: 'POST',
              data: data
           })
        },
        createBtbTipo: function(data){
          return $.ajax({
            url: api.url + 'tipo/create?accessToken=' + accessToken,
            method: 'POST',
            data: data
          })
        },
        createDoTipoResume: function(data){
          return $.ajax({
            url: api.url + 'tipo/do/resume?accessToken=' + accessToken,
            method: 'POST',
            data: data
          })
        }
    }
	}
});
