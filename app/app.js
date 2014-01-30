/**
 * Module dependencies.
 */

var express = require('express');
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
app.use(express.static(path.join(__dirname, '../public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
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

// Search terms and official account IDs, broken down by brand
var tr = {
  terms: ['techrepublic', 'tech republic', 't.co'],
  accountId: '6486602'
};
var sp = {
  terms: ['smartplanet', 'smart planet', 'smrt.io'],
  accountId: '34731203'
};
var zd = {
  terms: ['zdnet', 'zd net', 'z d net', 'zd.net'],
  accountId: '3819701'
};
var tpr = {
  terms: ['techproresearch', 'tech pro research'],
  accountId: '1415819869'
};
// TODO: Automate
var officialAccounts = '6486602,34731203,3819701,1415819869';

// Filters to use for Twitter stream
var filters = {
  // Terms to search for
  'track': tr.terms.concat(sp.terms).concat(zd.terms).concat(tpr.terms),
  // Account IDs to search for
  'follow': officialAccounts
}

function isBrandMatch(brand, tweet) {
  if (tweet.user.id == brand.accountId) {
    return true;
  }

  var regex = new RegExp('(\\b' + brand.terms.join('\\b)|(\\b') + '\\b)', 'i');
  console.log(regex);

  return regex.test(tweet.text);
}

twitter.stream('statuses/filter', filters, function(stream) {
  stream.on('data', function(tweet) {
    console.log('Received tweet ' + tweet.id);
    io.sockets.emit('tweet', tweet);

    // Send messages based on brand
    if (isBrandMatch(tr, tweet)) {
      io.sockets.emit('tr', tweet);
    }
    if (isBrandMatch(sp, tweet)) {
      io.sockets.emit('sp', tweet);
    }
    if (isBrandMatch(zd, tweet)) {
      io.sockets.emit('zd', tweet);
    }
    if (isBrandMatch(tpr, tweet)) {
      io.sockets.emit('tpr', tweet);
    }
  });
});

// ----------------------------------------------------------------------------
// Initialize HTTP server
// ----------------------------------------------------------------------------
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
