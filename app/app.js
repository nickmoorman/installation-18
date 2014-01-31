/**
 * Module dependencies.
 */

var express = require('express');
var sandbox = require('./routes/sandbox');
var http = require('http');
var path = require('path');
var ntwitter = require('ntwitter');
var sockio = require('socket.io');
var optimist = require('optimist');

var app = express();
var server = http.createServer(app);

// ----------------------------------------------------------------------------
// Optimist setup
// ----------------------------------------------------------------------------
// --no-socks runtime option to skip socket messages for server-only debug
optimist.default('nosocks', false);
var argv = optimist.argv;

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
var brands = [
  {
    name: 'TechRepublic',
    shortname: 'TR',
    socket: 'tr',
    terms: ['techrepublic', 'tech republic', 't.co'],
    accountId: '6486602'
  },
  {
    name: 'SmartPlanet',
    shortname: 'SP',
    socket: 'sp',
    terms: ['smartplanet', 'smart planet', 'smrt.io'],
    accountId: '34731203'
  },
  {
    name: 'ZDNet',
    shortname: 'ZD',
    socket: 'zd',
    terms: ['zdnet', 'zd net', 'z d net', 'zd.net'],
    accountId: '3819701'
  },
  {
    name: 'Tech Pro Research',
    shortname: 'TPR',
    socket: 'tpr',
    terms: ['techproresearch', 'tech pro research'],
    accountId: '1415819869'
  }
];
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
var metrics = {
  totalTweets: 0,
  tweetsPerBrand: {},
  tweetsPerLanguage: {
    'unknown': 0
  }
};

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

        // Update brand metrics
        if (metrics.tweetsPerBrand[brand.socket] == undefined) {
          metrics.tweetsPerBrand[brand.socket] = 0;
        }
        metrics.tweetsPerBrand[brand.socket] += 1;
      }
    });

    // Update language metrics
    if (tweet.lang) {
      if (metrics.tweetsPerLanguage[tweet.lang] == undefined) {
        metrics.tweetsPerLanguage[tweet.lang] = 0;
      }
      metrics.tweetsPerLanguage[tweet.lang] += 1;
    } else {
      metrics.tweetsPerLanguage['unknown'] += 1;
    }

    // Send updated metrics
    socketSend('metrics', metrics);
  });
});

// ----------------------------------------------------------------------------
// Initialize HTTP server
// ----------------------------------------------------------------------------
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
