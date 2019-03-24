module.exports = function(req, res, next){
	res.render('cashForm', {
		page: {
			title: 'Buat Kas Keluar',
			controllerName: 'createNewCashoutController',
			route: req.route.path,
			params: req.params,
			data: {
				controller: '/dist/js/controller/finance/createNewCashoutController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/paymentMethod.js', '/dist/js/directive/bank.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/cash.js', '/dist/js/services/bank.js', '/dist/js/services/customer.js']
			}
		}
	});
}
