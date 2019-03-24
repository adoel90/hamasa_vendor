module.exports = function(req, res, next){
	res.render('customerForm', {
		page : {
			title: 'Update Customer',
      controllerName: 'editCustomerController',
      route: req.route.path,
      params: req.params,
			data: {
				controller: '/dist/js/controller/sales/editCustomerController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/input.js', '/dist/js/directive/customerRegion.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/customer.js', '/dist/js/services/region.js']
			}
		}
	})
}
