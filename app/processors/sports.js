var tags = require('language-tags');
var Metrics = require('../objects/metrics');

module.exports = SportProcessor;

function SportProcessor(config, util) {
  this.config = config;
  this.util = util;
}

SportProcessor.prototype.run = function(twitter) {
  // Search terms and official account IDs, broken down by brand
  var sports = this.config.sports;

  var searchTerms = sports.map(function(brand) {
    return brand.terms.join(',');
  }).join(',');

  // Filters to use for Twitter stream
  var filters = {
    // Terms to search for
    'track': searchTerms
  };

  // Various metrics for accumulated data
  var metrics = new Metrics('sports');

  var self = this;

  twitter.stream('statuses/filter', filters, function(stream) {
    stream.on('data', function(tweet) {
      console.log('Received tweet ' + tweet.id);
      self.util.socketSend('tweet', tweet);
      metrics.totalTweets += 1;

      // Send messages based on sport
      sports.forEach(function(sport) {
        var regex = new RegExp('(\\b' + sport.terms.join('\\b)|(\\b') + '\\b)', 'i');
        if (tweet.user.id == sport.accountId || regex.test(tweet.text)) {
          self.util.socketSend(sport.socket, tweet);

          metrics.tweetsPerSport.add(sport.socket);
        }
      });

      // Get the proper language name if possible and add to metrics
      var t = tags.subtags(tweet.lang);
      var lang = tweet.lang;
      if (t.length > 0) {
        try {
          lang = t[0].data.record.Description[0];
        } catch (e) {
          console.error('Error determining language for "' + tweet.lang + '"');
        }
      }
      metrics.tweetsPerLanguage.add(lang);

      // Send updated metrics
      self.util.socketSend('metrics', metrics.clean());
      self.util.debug(metrics.clean());
    });
  });
}