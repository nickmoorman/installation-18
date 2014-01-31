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

function debug(message) {
  if (argv.debug) {
    console.log(message);
  }
}

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
// Initial Socket.IO stuff
// ----------------------------------------------------------------------------
var io;
if (!argv.nosocks) {
  io = sockio.listen(server);

  io.sockets.on('connection', function(socket) {
    socket.emit('data', 'connected!');
  });
}

function socketSend(socket, message) {
  if (!argv.nosocks) {
    io.sockets.emit(socket, message);
  }
}

// ----------------------------------------------------------------------------
// Twitter streaming API consumer, our app's "server"
// ----------------------------------------------------------------------------
var twitter = new ntwitter(require('./credentials.js').credentials);

// Search terms and official account IDs, broken down by brand
var brands = config.brands;

var searchTerms = brands.map(function(brand) {
  return brand.terms.join(',');
}).join(',');
var officialAccounts = brands.map(function(brand) {
  return brand.accountId;
}).join(',');

// Filters to use for Twitter stream
var filters = {
  // Terms to search for
  'track': searchTerms,
  // Account IDs to search for
  'follow': officialAccounts
};

// Various metrics for accumulated data
function Metric() {
  this._data = {};
};
Metric.prototype.add = function(key) {
  if (!(key in this._data)) {
    this._data[key] = 0;
  }
  this._data[key] += 1;
}
function Metrics() {
  this.totalTweets = 0;
  this.tweetsPerBrand = new Metric();
  this.tweetsPerLanguage = new Metric();
};
Metrics.prototype.clean = function() {
  return {
    totalTweets: this.totalTweets,
    tweetsPerBrand: this.tweetsPerBrand._data,
    tweetsPerLanguage: this.tweetsPerLanguage._data
  }
}

var metrics = new Metrics();

twitter.stream('statuses/filter', filters, function(stream) {
  stream.on('data', function(tweet) {
    console.log('Received tweet ' + tweet.id);
    socketSend('tweet', tweet);
    metrics.totalTweets += 1;

    // Send messages based on brand
    // TODO: Special handling for ZDNet tweets with t.co URLs
    brands.forEach(function(brand) {
      var regex = new RegExp('(\\b' + brand.terms.join('\\b)|(\\b') + '\\b)', 'i');
      if (tweet.user.id == brand.accountId || regex.test(tweet.text)) {
        socketSend(brand.socket, tweet);

        metrics.tweetsPerBrand.add(brand.socket);
      }
    });

    metrics.tweetsPerLanguage.add(tweet.lang);

    // Send updated metrics
    socketSend('metrics', metrics.clean());
    debug(metrics.clean());
  });
});

// ----------------------------------------------------------------------------
// Initialize HTTP server
// ----------------------------------------------------------------------------
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
