module.exports = function(req, res, next){
	res.render('itemHistory', {
		page : {
			title: 'Histori Stok Item',
			controllerName: 'itemHistoryController',
			route: req.route.path,
      params: req.params,
			data: {
				controller: '/dist/js/controller/sales/itemHistoryController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/input.js', '/dist/js/directive/table.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/item.js']
			}
		}
	})
}
