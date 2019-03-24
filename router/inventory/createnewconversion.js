module.exports = function(req, res, next){
    res.render('createNewConversion', {
        page: {
            title: 'Buat Konversi',
            controllerName: 'createNewConversionController',
            route: req.route.path,
            params: req.params,
            data: {
              controller: '/dist/js/controller/inventory/createNewConversionController.js',
              directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js'],
              service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/warehouse.js', '/dist/js/services/conversion.js']
            }
        }
    });
}
