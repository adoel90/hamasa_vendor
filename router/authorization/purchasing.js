module.exports = function(req, res, next){
  res.render('masterTemplate', {
		page: {
			title: 'List Otorisasi Pembelian',
			controllerName: 'purchasingAuthController',
			route: req.route.path,
      params: req.params,
      data: {
        controller: '/dist/js/controller/authorization/purchasingAuthController.js',
        directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/tableContent.js'],
        service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/purchase.js', '/dist/js/services/sales.js']
      }
		}
	});
}
