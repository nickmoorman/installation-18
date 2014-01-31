/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var ntwitter = require('ntwitter');
var sockio = require('socket.io');
var optimist = require('optimist');

var app = express();
var server = http.createServer(app);

// Load config file
var config = require('../public/config.js');

// ----------------------------------------------------------------------------
// Optimist setup
// ----------------------------------------------------------------------------
// --no-socks runtime option to skip socket messages for server-only debug
optimist.default('nosocks', false);
optimist.default('debug', false);
var argv = optimist.argv;

// ----------------------------------------------------------------------------
// Initial Socket.IO stuff
// ----------------------------------------------------------------------------
var io;
if (!argv.nosocks) {
  io = sockio.listen(server);

  io.sockets.on('connection', function(socket) {
    socket.emit('data', 'connected!');
  });
}

// ----------------------------------------------------------------------------
// Load util helper
// ----------------------------------------------------------------------------
var Util = require('./objects/util');
var util = new Util(argv, io);

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
app.use(express.static(path.join(__dirname, '../public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// ----------------------------------------------------------------------------
// Twitter streaming API consumer, our app's "server"
// ----------------------------------------------------------------------------
var twitter = new ntwitter(require('./credentials.js').credentials);

// Run brand processor to process tweets by brand
var BrandProcessor = require('./processors/brands');
var brandProcessor = new BrandProcessor(config, util);
brandProcessor.run(twitter);

// ----------------------------------------------------------------------------
// Initialize HTTP server
// ----------------------------------------------------------------------------
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
