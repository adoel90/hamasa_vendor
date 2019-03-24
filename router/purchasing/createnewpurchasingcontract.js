module.exports = function(req, res, next){
   res.render('createNewPurchasingContract', {
      page:{
         title: 'Buat Kontrak Pembelian',
         controllerName: 'createNewPurchasingContractController',
         route: req.route.path,
         params: req.params,
         data: {
   				controller: '/dist/js/controller/purchasing/createNewPurchasingContractController.js',
   				directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/itemFilter.js', '/dist/js/directive/showItemMasterList.js'],
   				service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/purchase.js', '/dist/js/services/supplier.js', '/dist/js/services/item.js']
   			}
      }
   })
}
