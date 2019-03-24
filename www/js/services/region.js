distributionApp.factory('$regionService', function() {
	return {
		get: {
			allProvince: function(){
				return $.get(api.url + 'region/province');
			},
			allCities: function(provinceId){
				return $.get(api.url + 'region/city?province_id=' + provinceId);
			},
			allDistrict: function(cityId){
				return $.get(api.url + 'region/district?city_id=' + cityId);
			},
			allUrban: function(districtId){
				return $.get(api.url + 'region/urban?district_id=' + districtId);
			}
			
		}
	}
});
