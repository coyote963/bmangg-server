var app = require('./app');
var PORT = process.env.PORT || 3000;

var server = app.listen(PORT, function() {
	console.log('Express server listening on port ' + PORT);
});
