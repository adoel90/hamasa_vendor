module.exports = function(req, res, next){
    res.render('customerSaldoReport', {
       page:{
          title: 'Laporan Saldo Customer',
          controllerName: 'customerSaldoReportController',
          route: req.route.path,
          params: req.params,
          data: {
            controller: '/dist/js/controller/report/sales/customerSaldoReportController.js',
            directive: ['/dist/js/directive/menu.js', '/dist/js/directive/scroll.js', '/dist/js/directive/pagination.js', '/dist/js/directive/table.js', '/dist/js/directive/input.js', '/dist/js/directive/tableContent.js'],
            service: ['/dist/js/services/modal.js', '/dist/js/services/landing.js', '/dist/js/services/cookies.js', '/dist/js/services/user.js', '/dist/js/services/report.js', '/dist/js/services/customer.js']
          }
       }
    })
 }
 