distributionApp.factory('$mutationService', function($myCookies) {
	var accessToken = $myCookies.get('accessToken');

	return {
		get: {
			mutationList: function(data) {
				return $.get(api.url + 'mutation/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&do=' + data.do + '&item_id=' + data.item_id + '&item_name=' + data.item_name)
			},
			mutationDetail: function(id) {
				return $.get(api.url + 'mutation/detail?accessToken=' + accessToken + '&id=' + id)
			}
		},
		post: {
			addMutation: function(data) {
				return $.ajax({
					url: api.url + 'mutation/create?accessToken=' + accessToken,
					method: 'POST',
					data: data
				});
			}
		},
		put: {
			closeMutation: function(data){
				return $.ajax({
					url: api.url + 'mutation/close?accessToken=' + accessToken,
					method: 'PUT',
					data: data
				})
			},
			closeMutationAndValidate: function(data){
				return $.ajax({
					url: api.url + 'mutation/close/validate?accessToken=' + accessToken,
					method: 'PUT',
					data: data
				})
			}
		}
	}
});
