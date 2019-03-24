module.exports = function(req, res, next){
	res.render('moduleMenuTemplate', {
		page : {
			title: 'Penjualan',
			controllerName: 'salesController',
			route: req.route.path,
			params: req.params,
			data: {
				controller: '/dist/js/controller/sales/salesController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js']
			}
		}
	})
}
