module.exports = function(req, res, next){
    res.render('gradeForm', {
        page: {
            title: 'Edit Grade',
            controllerName: 'editGradeMasterController',
            route: req.route.path,
            params: req.params,
            data: {
              controller: '/dist/js/controller/inventory/editGradeMasterController.js',
              directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js'],
              service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/grade.js']
            }
        }
    });
}
