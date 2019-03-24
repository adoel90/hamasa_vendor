module.exports = function(req, res, next){
   res.render('purchasingContract', { // ==> Here it is render "purchasingContract.pug"
      page:{
         title: 'Kontrak Pembelian',
         controllerName: 'purchasingContractController',
         route: req.route.path,
         params: req.params,
         data: {
   				controller: '/dist/js/controller/purchasing/purchasingContractController.js',
   				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/modal-pagination.js'],
   				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/purchase.js']
   			}
      }
   })
}
