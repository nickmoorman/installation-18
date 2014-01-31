var tags = require('language-tags');
var Learner = require('../machinelearning/learner');
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
  this.util.sendConnectMetrics(metrics);

  var learner = new Learner();
  learner.train();

  var self = this;

  twitter.stream('statuses/filter', filters, function(stream) {
    stream.on('data', function(tweet) {
      console.log('Received tweet ' + tweet.id);
      self.util.socketSend('tweet', tweet);
      metrics.totalTweets += 1;

      // Send messages based on sport
      /* Might go back to this soon if the machine learning doesn't work out...
      sports.forEach(function(sport) {
        var regex = new RegExp('(\\b' + sport.terms.join('\\b)|(\\b') + '\\b)', 'i');
        if (tweet.user.id == sport.accountId || regex.test(tweet.text)) {
          self.util.socketSend(sport.socket, tweet);

          metrics.tweetsPerSport.add(sport.socket);
        }
      });
      */
      // Classify tweet using machine learning and send to the proper socket
      var classification = learner.classify(tweet.text);
      if (classification.length > 0) {
        self.util.socketSend(classification[0], tweet);
        metrics.tweetsPerSport.add(classification[0]);
      }
      self.util.debug(tweet.text);
      self.util.debug(classification);

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