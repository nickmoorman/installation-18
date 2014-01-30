/*
 * GET playground page.
 */

var http = require('http');
var request = require('request');

exports.sandbox = function(req, res) {
  request('http://prod-tr-api-lb01.ec2.cbsi.com/api/content/article/?edition=us&fields=id%2Cheadline&limit=5', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
};
