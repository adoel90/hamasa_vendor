module.exports = function(req, res, next){
	res.render('createNewSalesOrderForTipo', {
		page: {
			title: 'Buat Sales Order Tipo',
			controllerName: 'createNewSalesOrderForTipoController',
			route: req.route.path,
			params: req.params,
			data: {
				controller: '/dist/js/controller/sales/createNewSalesOrderForTipoController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/jasaPotong.js', '/dist/js/directive/itemFilter.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/customer.js', '/dist/js/services/sales.js']
			}
		}
	})
}
