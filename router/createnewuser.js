module.exports = function(req, res, next){
   res.render('userForm', {
      page: {
         title: 'Buat User Baru',
         controllerName: 'createNewUserController',
         route: req.route.path,
         params: req.params,
         data: {
   				controller: '/dist/js/controller/userManagement/createNewUserController.js',
   				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js'],
   				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/warehouse.js']
   			}
      }
   });
}
