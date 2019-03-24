module.exports = function(req, res, next){
	res.render('dashboard', {
		page: {
			title: 'Dashboard',
			controllerName: 'dashboardController',
			route: req.route.path,
      params: req.params,
			data: {
				controller: '/dist/js/controller/dashboard/dashboardController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/dashboard.js']
			}
		}
	});
}
