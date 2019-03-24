var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	pug = require('pug');
	port = 7000;

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(cookieParser());
app.use(require(__dirname+'/engine'));

app.listen(port, function(){
	console.log("Express server is on! Listening on port " + port);

});
