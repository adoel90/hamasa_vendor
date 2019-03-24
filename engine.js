var express = require('express'),
	session = require('express-session'),
	$routers = require(__dirname+'/router'),
	app = express();

module.exports = (function(){
	'use strict'

	app.set('view cache', true);
	app.set('view engine', 'pug');
	app.set('views',__dirname+'/www/view');


	app.use('/dist', express.static(__dirname+'/dist'));

	var $activeCORS = function(req, res, next){
		res.header('Access-Control-Allow-Origin','*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');

		next();
	}
	//Activate CORS Middleware
	app.use($activeCORS);

	//Setting up Routers
	app.use($routers);

	return app;
})();
