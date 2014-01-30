/*
 * GET playground page.
 */

var http = require('http');
var request = require('request');
var ntwitter = require('ntwitter');

exports.sandbox = function(req, res) {
  request('http://prod-tr-api-lb01.ec2.cbsi.com/api/content/article/?edition=us&fields=id%2Cheadline&limit=5', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
};

exports.twitter = function(req, res) {
  var twitter = new ntwitter(require('../credentials.js').credentials);

  var filters = {
    'track': ['cbs', 'cbs interactive', 'cnet', 'techrepublic', 'smartplanet', 'tech pro research', 'zdnet']
  }

  twitter.stream('statuses/filter', filters, function(stream) {
    stream.on('data', function(data) {
      console.log(data);
    });
  });
};
