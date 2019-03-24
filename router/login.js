module.exports = function(req,res,next){
	res.render('login',{
		page: {
			title: 'Log In',
			controllerName: 'loginController',
			route: req.route.path,
			params: req.params,
			data: {
				controller: '/dist/js/controller/loginController.js',
				directive: [''],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js']
			}
		}
	})
}
