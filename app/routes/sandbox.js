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
  var twitter = new ntwitter({
    consumer_key: 'bViLt6w2D1bQlWfUHb7A',
    consumer_secret: 'aI3Lt0VHXd60Wq9RHKBYx01hSfMjDMZwuOx8NVGQDc',
    access_token_key: '7061612-MUc8DhtFtjyxB6BGxgVOZZGiGifQ1vlpmdl5xGKquj',
    access_token_secret: '54u3yLbz9bCMh8CEun9j5PBkQLmPzV7R9ElYzLPgbdGos'
  });

  twitter.stream('statuses/sample', function(stream) {
    stream.on('data', function(data) {
      console.log(data);
    });
  });
};
