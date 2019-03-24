module.exports = function(req, res, next){
   res.render('createNewPaymentForPo', {
      page:{
         title: 'Buat Pelunasan Hutang',
         controllerName: 'createNewPaymentForPoController',
         route: req.route.path,
         params: req.params,
         data: {
           controller: '/dist/js/controller/finance/createNewPaymentForPoController.js',
           directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/bank.js', '/dist/js/directive/paymentMethod.js', '/dist/js/directive/copyTotalToPay.js', '/dist/js/directive/calculatePaidChanged.js', '/dist/js/directive/validatePayment.js', '/dist/js/directive/tableContent.js', '/dist/js/directive/showSupplierList.js'],
           service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/payment.js', '/dist/js/services/supplier.js', '/dist/js/services/bank.js', '/dist/js/services/invoice.js']
         }
      }
   })
}
