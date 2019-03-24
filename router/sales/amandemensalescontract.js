module.exports = function(req, res, next){
	res.render('amandemenSalesContract', {
		page : {
			title: 'Amandemen Kontrak Penjualan',
			controllerName: 'amandemenSalesContractController',
			route: req.route.path,
      params: req.params,
			data: {
				controller: '/dist/js/controller/sales/amandemenSalesContractController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/input.js', '/dist/js/directive/table.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/sales.js']
			}
		}
	})
}
