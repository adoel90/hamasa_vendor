module.exports = function(req, res, next){
   res.render('settings',{
      page: {
         title: 'Setting',
         controllerName: 'settingsController',
         route: req.route.path,
         params: req.params,
         data: {
   				controller: '/dist/js/controller/settingsController.js',
   				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/input.js', '/dist/js/directive/table.js'],
   				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js']
   			}
      }
   })
}
