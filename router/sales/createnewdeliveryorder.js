module.exports = function(req, res, next){
	res.render('createNewDeliveryOrder', {
		page : {
			title: 'Buat Delivery Order Baru',
			controllerName: 'createNewDeliveryOrderController',
			route: req.route.path,
			params: req.params,
			data: {
				controller: '/dist/js/controller/sales/createNewDeliveryOrderController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/showSalesPrice.js', '/dist/js/directive/itemFilter.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/warehouse.js', '/dist/js/services/do.js', '/dist/js/services/sales.js']
			}
		}
	})
}
