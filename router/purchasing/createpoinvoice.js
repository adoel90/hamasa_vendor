module.exports = function(req, res, next){
	res.render('poInvoiceForm', {
		page: {
			title: 'Buat PO Invoice',
			controllerName: 'createPoInvoiceController',
			route: req.route.path,
			params: req.params,
			data: {
				controller: '/dist/js/controller/purchasing/createPoInvoiceController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/showBtbHistory.js', '/dist/js/directive/showPoDetail.js', '/dist/js/directive/tableContent.js', '/dist/js/directive/showSupplierList.js', '/dist/js/directive/pagination.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/purchase.js', '/dist/js/services/supplier.js']
			}
		}
	});
}
