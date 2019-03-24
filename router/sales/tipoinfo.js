module.exports = function(req, res, next){
	res.render('tipoInfo', {
		page : {
			title: 'Informasi TIPO',
			controllerName: 'tipoInfoController',
			route: req.route.path,
			params: req.params,
			data: {
				controller: '/dist/js/controller/sales/tipoInfoController.js',
				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/tableContent.js', '/dist/js/directive/showTipoDetail.js', '/dist/js/directive/showSoDetail.js', '/dist/js/directive/showInvoiceDetail.js', '/dist/js/directive/showDoDetail.js'],
				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/sales.js', '/dist/js/services/spk.js', '/dist/js/services/tipo.js', '/dist/js/services/invoice.js', '/dist/js/services/do.js']
			}
		}
	})
}
