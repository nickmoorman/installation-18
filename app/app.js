/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var sandbox = require('./routes/sandbox');
var http = require('http');
var path = require('path');
var ntwitter = require('ntwitter');
var sockio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = sockio.listen(server);

// ----------------------------------------------------------------------------
// Express app setup
// ----------------------------------------------------------------------------
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
app.get('/', routes.index);
// NOTE: will probably move this to index route
app.get('/client', function(req, res) {
  res.sendfile(__dirname + '/views/client.html');
});
app.get('/sandbox', sandbox.sandbox);
app.get('/sandbox/twitter', sandbox.twitter);

// ----------------------------------------------------------------------------
// Initial Socket.IO stuff
// ----------------------------------------------------------------------------
io.sockets.on('connection', function(socket) {
  socket.emit('data', 'connected!');
});

// ----------------------------------------------------------------------------
// Twitter streaming API consumer, our app's "server"
// ----------------------------------------------------------------------------
var twitter = new ntwitter(require('./credentials.js').credentials);

var filters = {
  'track': ['cbs', 'cbs interactive', 'cnet', 'techrepublic', 'smartplanet', 'tech pro research', 'zdnet']
}

twitter.stream('statuses/filter', filters, function(stream) {
  stream.on('data', function(tweet) {
    console.log('Received tweet ' + tweet.id);
    io.sockets.emit('data', 'Received tweet ' + tweet.id);
  });
});

// ----------------------------------------------------------------------------
// Initialize HTTP server
// ----------------------------------------------------------------------------
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
