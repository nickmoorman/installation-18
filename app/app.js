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
// Logging
// ----------------------------------------------------------------------------

var fs = require('fs');
var log_file = fs.createWriteStream(__dirname + '/stdout.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(d + '\n');
  log_stdout.write(d + '\n');
};

process.on("uncaughtException", function(err) {
    console.log(err.stack);
});


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

// Run processor requested by command line option --mode; default is brands
switch(argv.mode) {
  case 'sports':
    var SportProcessor = require('./processors/sports');
    var sportProcessor = new SportProcessor(config, util);
    sportProcessor.run(twitter);
    break;
  default:
    var BrandProcessor = require('./processors/brands');
    var brandProcessor = new BrandProcessor(config, util);
    brandProcessor.run(twitter);
}

// ----------------------------------------------------------------------------
// Initialize HTTP server
// ----------------------------------------------------------------------------
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
