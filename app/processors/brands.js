var Metrics = require('../objects/metrics');

module.exports = BrandProcessor;

function BrandProcessor(config, util) {
  this.config = config;
  this.util = util;
}

BrandProcessor.prototype.run = function(twitter) {
  // Search terms and official account IDs, broken down by brand
  var brands = this.config.brands;

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
  var metrics = new Metrics();

  var self = this;

  twitter.stream('statuses/filter', filters, function(stream) {
    stream.on('data', function(tweet) {
      self.util.debug(brands);
      console.log('Received tweet ' + tweet.id);
      self.util.socketSend('tweet', tweet);
      metrics.totalTweets += 1;

      // Send messages based on brand
      // TODO: Special handling for ZDNet tweets with t.co URLs
      brands.forEach(function(brand) {
        var regex = new RegExp('(\\b' + brand.terms.join('\\b)|(\\b') + '\\b)', 'i');
        if (tweet.user.id == brand.accountId || regex.test(tweet.text)) {
          self.util.socketSend(brand.socket, tweet);

          metrics.tweetsPerBrand.add(brand.socket);
        }
      });

      metrics.tweetsPerLanguage.add(tweet.lang);

      // Send updated metrics
      self.util.socketSend('metrics', metrics.clean());
      self.util.debug(metrics.clean());
    });
  });
}