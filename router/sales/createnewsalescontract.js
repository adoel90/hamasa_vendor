module.exports = function(req, res, next){
	res.render('createNewSalesContract', {
		page : {
			title: 'Buat Kontrak Penjualan',
			controllerName: 'createNewSalesContractController',
			route: req.route.path,
			params: req.params,
			data: {
				controller: '/dist/js/controller/sales/createNewSalesContractController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/input.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/showItemMasterList.js', '/dist/js/directive/itemFilter.js', '/dist/js/directive/itemCategory.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/customer.js', '/dist/js/services/sales.js', '/dist/js/services/item.js', '/dist/js/services/category.js']
			}
		}
	})
}
