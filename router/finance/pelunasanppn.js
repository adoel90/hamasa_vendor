module.exports = function(req, res, next){
    res.render('pelunasanPpn', {
       page:{
          title: 'Pelunasan PPN Customer',
          controllerName: 'pelunasanPpnController',
          route: req.route.path,
          params: req.params,
          data: {
            controller: '/dist/js/controller/finance/pelunasanPpnController.js',
            directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/bank.js', '/dist/js/directive/paymentMethod.js', '/dist/js/directive/customerList.js'],
            service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/payment.js', '/dist/js/services/customer.js', '/dist/js/services/bank.js']
          }
       }
    })
 } 