module.exports = function(req, res, next){
    res.render('createNewBtb', {
        page: {
            title: 'Buat Bukti Terima Barang',
            controllerName: 'createNewBtbController',
            route: req.route.path,
            params: req.params,
            data: {
              controller: '/dist/js/controller/inventory/createNewBtbController.js',
              directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/showBtbHistory.js', '/dist/js/directive/showItemMasterList.js', '/dist/js/directive/itemFilter.js'],
              service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/item.js', '/dist/js/services/purchase.js', '/dist/js/services/btb.js', '/dist/js/services/mutation.js', '/dist/js/services/do.js']
            }
        }
    });
}
