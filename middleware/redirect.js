var _ = require('underscore');
module.exports = function(req, res, next){
   var securePath = [
      '/sales',
      '/warehousemaster'
   ]

   if(!req.cookies.accessToken){
      return res.redirect('/login');
   }

   next();
}
