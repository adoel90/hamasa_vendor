distributionApp.factory('$gradeService', function($myCookies){
  var accessToken = $myCookies.get('accessToken');
  return{
    get: {
      allGrade: function(){
        return $.get(api.url + 'item/grade?accessToken=' + accessToken);
      },
      listItemGrade: function(data){
        return $.get(api.url + 'item/grade/list?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset);
      },
      detailItemGrade: function(id){
        return $.get(api.url + 'item/grade/detail?accessToken=' + accessToken + '&id=' + id);
      }
    },
    post: {
      createItemGrade: function(data){
        return $.ajax({
          url: api.url + 'item/grade/create?accessToken=' + accessToken,
          method: 'POST',
          data: data
        })
      }
    },
    put: {
      updateItemGrade: function(data){
        return $.ajax({
          url: api.url + 'item/grade/update?accessToken=' + accessToken,
          method: 'PUT',
          data: data
        })
      }
    },
    delete: {
      deleteItemGrade: function(data){
        return $.ajax({
          url: api.url + 'item/grade/delete?accessToken=' + accessToken,
          method: 'DELETE',
          data: data
        })
      }
    }
  }
})
