var config = require('./server/config');
var app = require('./server/app');

app.set('port', config.port || 8080);
app.set('host', config.host || '127.0.0.1');

var server = app.listen(app.get('port'), app.get('host'), function(){
	console.log('Listening on %s:%d', server.address().address, server.address().port);
});